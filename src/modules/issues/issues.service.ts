import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";

interface I_Issue {
  title: string;
  description: string;
  type: string;
  status?: string
}
const createIssuesIntoDB = async (payload: I_Issue, userId: string) => {
  const { title, description, type } = payload;

  if (!title || !description || !type) {
    throw new Error("title, description, type needed");
  }
  if (type !== "bug" && type !== "feature_request") {
    throw new Error(
      "Invalid Type: Type must be either 'bug' or 'feature_request'.",
    );
  }

  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
    [title, description, type, userId],
  );
  return result;
};

const getAllIssuesFromDB = async (payload: Record<string, unknown>) => {
  const { sort, type, status } = payload;
  let sql = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type as string);
    conditions.push(`type = $${values.length}`);
  }
  if (status) {
    values.push(status as string);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  const issuesResult = await pool.query(sql, values);

  const issues = issuesResult.rows;

  if (issues.length === 0) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const usersMap = new Map();

  usersResult.rows.forEach((user) => {
    usersMap.set(user.id, user);
  });

  const formattedIssues = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: usersMap.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return formattedIssues;
};

const getSingleIssueFromDb = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id],
  );

  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [issue.reporter_id],
  );

  const reporter = userResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueIntoDb = async (
  issueId: string,
  payload: I_Issue,
  user: JwtPayload,
) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues
    WHERE id = $1
    `,
    [issueId],
  );
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const issue = issueResult.rows[0];
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You can update only your own issues");
    }

    if (issue.status !== "open") {
      throw new Error("Open issues only can be updated");
    }
  }
  const title = (payload.title as string) ?? issue.title;

  const description = (payload.description as string) ?? issue.description;

  const type = (payload.type as string) ?? issue.type;
  let status = issue.status;

  if (user.role === "maintainer" && payload.status) {
    status = payload.status as string;
  }

  const updatedResult = await pool.query(
    `
    UPDATE issues
    SET
      title = $1,
      description = $2,
      type = $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *
    `,
    [title, description, type, status, issueId],
  );

  return updatedResult.rows[0];
};

const deleteIssueFromDb = async (id: string) => {
  const issue = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1
    `,
    [id],
  );

  if (issue.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const result = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
    `,
    [id],
  );
  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDb,
  updateIssueIntoDb,
  deleteIssueFromDb,
};
