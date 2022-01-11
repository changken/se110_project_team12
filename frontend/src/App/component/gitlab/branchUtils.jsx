import moment from 'moment';

export function locateBranchLastCommittedAt(branchData, startMonth, endMonth) {
  let chartDataset = {
    labels: [],
    data: {},
  };
  //initial branch name
  new Set(branchData.map(branch => branch.name)).forEach(branchName => {
    chartDataset.data[branchName] = [];
  });
  //loop branch locate!
  for (
    let month = moment(startMonth);
    month <= moment(endMonth);
    month = month.add(1, 'months')
  ) {
    chartDataset.labels.push(month.format('YYYY-MM'));
    // initial branch count data
    for (var key in chartDataset.data) {
      chartDataset.data[key].push(0);
    }
    branchData.forEach(branchData => {
      if (
        moment(branchData.commit.committed_date).format('YYYY-MM') ==
        month.format('YYYY-MM')
      ) {
        chartDataset.data[branchData.name][chartDataset.labels.length - 1] += 1;
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
  return chartDataset;
}
