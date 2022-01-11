import moment from 'moment';
import { countIssues } from './issueUtils';

let issueData = [
  {
    id: 100306895,
    iid: 1,
    project_id: 32669334,
    title: "Could you put the team's source code to this repo, please?",
    description: 'As title',
    state: 'opened',
    created_at: '2022-01-09T07:26:04.278Z',
    updated_at: '2022-01-09T07:26:04.278Z',
    closed_at: null,
    closed_by: null,
    labels: [],
    milestone: null,
    assignees: [],
    author: {
      id: 2401915,
      username: 'changken',
      name: 'changken',
      state: 'active',
      avatar_url:
        'https://secure.gravatar.com/avatar/f421072c73cb3cfd6f9ff1723e7abf96?s=80&d=identicon',
      web_url: 'https://gitlab.com/changken',
    },
    type: 'ISSUE',
    assignee: null,
    user_notes_count: 0,
    merge_requests_count: 0,
    upvotes: 0,
    downvotes: 0,
    due_date: null,
    confidential: false,
    discussion_locked: null,
    issue_type: 'issue',
    web_url: 'https://gitlab.com/changken/se110_project_team12/-/issues/1',
    time_stats: {
      time_estimate: 0,
      total_time_spent: 0,
      human_time_estimate: null,
      human_total_time_spent: null,
    },
    task_completion_status: {
      count: 0,
      completed_count: 0,
    },
    weight: null,
    blocking_issues_count: 0,
    has_tasks: false,
    _links: {
      self: 'https://gitlab.com/api/v4/projects/32669334/issues/1',
      notes: 'https://gitlab.com/api/v4/projects/32669334/issues/1/notes',
      award_emoji:
        'https://gitlab.com/api/v4/projects/32669334/issues/1/award_emoji',
      project: 'https://gitlab.com/api/v4/projects/32669334',
    },
    references: {
      short: '#1',
      relative: '#1',
      full: 'changken/se110_project_team12#1',
    },
    moved_to_id: null,
    service_desk_reply_to: null,
    health_status: null,
  },
  {
    id: 100306895,
    iid: 1,
    project_id: 32669334,
    title: 'Cryptocurrency is great!',
    description: 'As title',
    state: 'opened',
    created_at: '2021-05-09T07:26:04.278Z',
    updated_at: '2021-05-09T07:26:04.278Z',
    closed_at: '2021-06-09T08:30:00.000Z',
    closed_by: null,
    labels: [],
    milestone: null,
    assignees: [],
    author: {
      id: 2401915,
      username: 'changken',
      name: 'changken',
      state: 'active',
      avatar_url:
        'https://secure.gravatar.com/avatar/f421072c73cb3cfd6f9ff1723e7abf96?s=80&d=identicon',
      web_url: 'https://gitlab.com/changken',
    },
    type: 'ISSUE',
    assignee: null,
    user_notes_count: 0,
    merge_requests_count: 0,
    upvotes: 0,
    downvotes: 0,
    due_date: null,
    confidential: false,
    discussion_locked: null,
    issue_type: 'issue',
    web_url: 'https://gitlab.com/changken/se110_project_team12/-/issues/1',
    time_stats: {
      time_estimate: 0,
      total_time_spent: 0,
      human_time_estimate: null,
      human_total_time_spent: null,
    },
    task_completion_status: {
      count: 0,
      completed_count: 0,
    },
    weight: null,
    blocking_issues_count: 0,
    has_tasks: false,
    _links: {
      self: 'https://gitlab.com/api/v4/projects/32669334/issues/1',
      notes: 'https://gitlab.com/api/v4/projects/32669334/issues/1/notes',
      award_emoji:
        'https://gitlab.com/api/v4/projects/32669334/issues/1/award_emoji',
      project: 'https://gitlab.com/api/v4/projects/32669334',
    },
    references: {
      short: '#1',
      relative: '#1',
      full: 'changken/se110_project_team12#1',
    },
    moved_to_id: null,
    service_desk_reply_to: null,
    health_status: null,
  },
];
let endMonth = '2022-01';

test('test countIssues function', () => {
  let chartDataset = countIssues(issueData, endMonth);
  console.log(chartDataset);
  expect(true).toBe(false);
});

test('test moment', () => {
  console.log(moment('2022-01-09T07:26:04.278Z'));
});

test("test data object's getTime", () => {
  console.log(new Date('2022-01-09T07:26:04.278Z').getTime());
});
