import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../types/userRole";



const router = Router()

router.post('/', auth(userRole.contributor, userRole.maintainer), issuesController.createIssue)
router.get("/", issuesController.getAllIssues)
router.get("/:id", issuesController.getSingleIssues)


export const issuesRouter = router