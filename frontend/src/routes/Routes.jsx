import Login from '../App/component/Login';
import SelectProject from '../App/component/SelectProject';
import DashboardPage from '../App/component/DashboardPage';
import CommitsPage from '../App/component/CommitsPage';
import IssuesPage from '../App/component/IssuesPage';
import CodeBasePage from '../App/component/CodeBasePage';
import CodeCoveragePage from '../App/component/CodeCoveragePage';
import BugsPage from '../App/component/BugsPage';
import CodeSmellsPage from '../App/component/CodeSmellsPage';
import DuplicationsPage from '../App/component/DuplicationsPage';
import GithubAuthorize from '../App/component/GithubAuthorize';
import GitlabOauthRedirect from '../App/component/GitlabOauthRedirect';
import GitlabCommitsPage from '../App/component/GitlabCommitsPage';
import GitlabIssuesPage from '../App/component/GitlabIssuesPage';
import GitlabCodeBasePage from '../App/component/GitlabCodeBasePage';
import GitlabMergeRequestPage from '../App/component/GitlabMergeRequestPage';
import GitlabBranchsPage from '../App/component/GitlabBranchsPage';

const routes = [
  { path: '/', redirect: true, to: '/select' },
  { path: '/login', component: Login, loginRequired: false },
  { path: '/select', component: SelectProject, loginRequired: true },
  { path: '/dashboard', component: DashboardPage, loginRequired: true },
  { path: '/commits', component: CommitsPage, loginRequired: true },
  { path: '/issues', component: IssuesPage, loginRequired: true },
  { path: '/codebase', component: CodeBasePage, loginRequired: true },
  { path: '/oauth-callback/github', component: GithubAuthorize, loginRequired: true},
  {
    path: '/gitlabcommits/:id',
    component: GitlabCommitsPage,
    loginRequired: true,
  },
  {
    path: '/gitlabissues/:id',
    component: GitlabIssuesPage,
    loginRequired: true,
  },
  {
    path: '/gitlabcodebase/:id',
    component: GitlabCodeBasePage,
    loginRequired: true,
  },
  {
    path: '/gitlabmr/:id',
    component: GitlabMergeRequestPage,
    loginRequired: true,
  },
  {
    path: '/gitlabbranch/:id',
    component: GitlabBranchsPage,
    loginRequired: true,
  },
  { path: '/code_coverage', component: CodeCoveragePage, loginRequired: true },
  { path: '/bugs', component: BugsPage, loginRequired: true },
  { path: '/code_smells', component: CodeSmellsPage, loginRequired: true },
  { path: '/duplications', component: DuplicationsPage, loginRequired: true },
  {
    path: '/oauth-callback',
    component: GitlabOauthRedirect,
    loginRequired: true,
  },
];

export default routes;
