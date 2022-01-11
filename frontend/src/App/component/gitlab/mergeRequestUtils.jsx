import moment from 'moment';

export function countMergeRequest(mrListData, endMonth) {
  let chartDataset = { labels: [], data: { created: [], merged: [] } };
  let mrListDataSortedByCreatedAt = mrListData;
  let mrListDataSortedByMergedAt = mrListData;

  //https://stackoverflow.com/questions/41673669/how-to-sort-object-array-by-time-in-javascript
  mrListDataSortedByCreatedAt.sort((a, b) => {
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
  mrListDataSortedByMergedAt.sort((a, b) => {
    let mergedAtA = new Date(a.merged_at).getTime();
    let mergedAtB = new Date(b.merged_at).getTime();
    if (mergedAtA > mergedAtB) {
      return -1;
    } else if (mergedAtA < mergedAtB) {
      return 1;
    } else {
      return 0;
    }
  });

  // mrListDataSortedByCreatedAt.sort((a, b) => a.created_at - b.created_at);
  // mrListDataSortedByMergedAt.sort((a, b) => a.merged_at - b.merged_at);

  //當mrListData有資料的時候
  if (mrListDataSortedByCreatedAt.length > 0) {
    for (
      let month = moment(mrListDataSortedByCreatedAt[0].created_at);
      month <= moment(endMonth).add(1, 'months');
      month = month.add(1, 'months')
    ) {
      let index;
      chartDataset.labels.push(month.format('YYYY-MM'));

      index = mrListDataSortedByCreatedAt.findIndex(mr => {
        return (
          moment(mr.created_at).year() > month.year() ||
          (moment(mr.created_at).year() == month.year() &&
            moment(mr.created_at).month() > month.month())
        );
      });
      chartDataset.data.created.push(index == -1 ? mrListData.length : index);

      //聚合merged_at
      index = mrListDataSortedByMergedAt.findIndex(mr => {
        return (
          moment(mr.merged_at).year() > month.year() ||
          (moment(mr.merged_at).year() == month.year() &&
            moment(mr.merged_at).month() > month.month())
        );
      });
      chartDataset.data.merged.push(index == -1 ? mrListData.length : index);
    }
  }

  return chartDataset;
}
