import moment from 'moment';

export function countIssues(issueListData, endMonth) {
  let chartDataset = { labels: [], data: { created: [], closed: [] } };
  let issueListDataSortedByCreatedAt = issueListData;
  let issueListDataSortedByClosedAt = issueListData;

  //https://stackoverflow.com/questions/41673669/how-to-sort-object-array-by-time-in-javascript
  issueListDataSortedByCreatedAt.sort((a, b) => {
    let createdAtA = new Date(a.created_at).getTime();
    let createdAtB = new Date(b.created_at).getTime();
    if (createdAtA > createdAtB) {
      return -1;
    } else if (createdAtA < createdAtB) {
      return 1;
    } else {
      return 0;
    }
  });
  issueListDataSortedByClosedAt.sort((a, b) => {
    let closedAtA = new Date(a.closed_at).getTime();
    let closedAtB = new Date(b.closed_at).getTime();
    if (closedAtA > closedAtB) {
      return -1;
    } else if (closedAtA < closedAtB) {
      return 1;
    } else {
      return 0;
    }
  });

  if (issueListDataSortedByCreatedAt.length > 0) {
    for (
      let month = moment(issueListDataSortedByCreatedAt[0].created_at);
      month <= moment(endMonth).add(1, 'months');
      month = month.add(1, 'months')
    ) {
      let index;
      chartDataset.labels.push(month.format('YYYY-MM'));

      index = issueListDataSortedByCreatedAt.findIndex(issue => {
        return (
          moment(issue.created_at).year() > month.year() ||
          (moment(issue.created_at).year() == month.year() &&
            moment(issue.created_at).month() > month.month())
        );
      });
      chartDataset.data.created.push(
        index == -1 ? issueListData.length : index
      );

      index = issueListDataSortedByClosedAt.findIndex(issue => {
        return (
          moment(issue.closed_at).year() > month.year() ||
          (moment(issue.closed_at).year() == month.year() &&
            moment(issue.closed_at).month() > month.month())
        );
      });
      chartDataset.data.closed.push(index == -1 ? issueListData.length : index);
    }
  }

  return chartDataset;
}
