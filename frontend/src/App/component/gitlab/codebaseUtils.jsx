import moment from 'moment';

export function countCodebase(commitListData, startMonth, endMonth) {
  let chartDataset = { labels: [], data: { additions: [], deletions: [] } };
  for (
    let month = moment(startMonth);
    month <= moment(endMonth);
    month = month.add(1, 'months')
  ) {
    chartDataset.labels.push(month.format('YYYY-MM'));

    chartDataset.data.additions.push(
      commitListData
        .filter(commit => {
          return (
            moment(commit.committed_date).format('YYYY-MM') ==
            month.format('YYYY-MM')
          );
        })
        .reduce(function (additionSum, currentCommit) {
          return additionSum + currentCommit.stats.additions;
        }, 0)
    );
    chartDataset.data.deletions.push(
      commitListData
        .filter(commit => {
          return (
            moment(commit.committed_date).format('YYYY-MM') ==
            month.format('YYYY-MM')
          );
        })
        .reduce(function (deletionSum, currentCommit) {
          return deletionSum - currentCommit.stats.deletions;
        }, 0)
    );
  }

  return chartDataset;
}
