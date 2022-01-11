import moment from 'moment';

export function countCommitsByTeam(commitListData, startMonth, endMonth) {
  let chartDataset = { labels: [], data: { team: [] } };
  for (
    let month = moment(startMonth);
    month <= moment(endMonth);
    month = month.add(1, 'months')
  ) {
    chartDataset.labels.push(month.format('YYYY-MM'));
    chartDataset.data.team.push(
      commitListData.filter(commit => {
        return (
          moment(commit.committed_date).format('YYYY-MM') ==
          month.format('YYYY-MM')
        );
      }).length
    );
  }

  return chartDataset;
}

export function countCommitsByMember(
  commitListData,
  startMonth,
  endMonth,
  numberOfMember
) {
  let chartDataset = {
    labels: [],
    data: {},
  };
  new Set(commitListData.map(commit => commit.author_name)).forEach(author => {
    chartDataset.data[author] = [];
  });
  for (
    let month = moment(startMonth);
    month <= moment(endMonth);
    month = month.add(1, 'months')
  ) {
    chartDataset.labels.push(month.format('YYYY-MM'));
    for (var key in chartDataset.data) {
      chartDataset.data[key].push(0);
    }
    commitListData.forEach(commitData => {
      if (
        moment(commitData.committed_date).format('YYYY-MM') ==
        month.format('YYYY-MM')
      ) {
        chartDataset.data[commitData.author_name][
          chartDataset.labels.length - 1
        ] += 1;
      }
    });
  }
  let temp = Object.keys(chartDataset.data).map(key => [
    key,
    chartDataset.data[key],
  ]);
  temp.sort(
    (first, second) =>
      second[1].reduce((a, b) => a + b) - first[1].reduce((a, b) => a + b)
  );
  let result = {};
  temp.slice(0, numberOfMember).forEach(x => {
    result[x[0]] = x[1];
  });
  chartDataset.data = result;

  return chartDataset;
}
