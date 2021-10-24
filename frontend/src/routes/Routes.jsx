import Login from '../App/component/Login'
import SelectProject from '../App/component/SelectProject'
import DashboardPage from '../App/component/DashboardPage'
import CommitsPage from '../App/component/CommitsPage'
import IssuesPage from '../App/component/IssuesPage'
import CodeBasePage from '../App/component/CodeBasePage'
import CodeCoveragePage from '../App/component/CodeCoveragePage'
import BugsPage from '../App/component/BugsPage'
import CodeSmellsPage from '../App/component/CodeSmellsPage'
import DuplicationsPage from '../App/component/DuplicationsPage'

const routes = [
  {path: "/", redirect: true, to:"/select"},
  {path: "/login", component: Login, loginRequired: false},
  {path: "/select", component: SelectProject, loginRequired: true},
  {path: "/dashboard", component: DashboardPage, loginRequired: true},
  {path: "/commits", component: CommitsPage, loginRequired: true},
  {path: "/issues", component: IssuesPage, loginRequired: true},
  {path: "/codebase", component: CodeBasePage, loginRequired: true},
  {path: "/code_coverage", component: CodeCoveragePage, loginRequired: true},
  {path: "/bugs", component: BugsPage, loginRequired: true},
  {path: "/code_smells", component: CodeSmellsPage, loginRequired: true},
  {path: "/duplications", component: DuplicationsPage, loginRequired: true},
]

export default routes