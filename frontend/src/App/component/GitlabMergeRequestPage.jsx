import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProjectAvatar from './ProjectAvatar';
import DrawingBoard from './DrawingBoard';
import Axios from 'axios';
import moment from 'moment';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    minWidth: '30px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function GitlabMergeRequestPage(prop) {
  const classes = useStyles();
  //merge request data
  const [mrListData, setMrListData] = useState([]);
  const [dataForMrChart, setDataForMrChart] = useState({
    labels: [],
    data: { created: [], merged: [] },
  });

  const [currentProject, setCurrentProject] = useState({});

  const { access_token, username } = useSelector(state => state.oauth);
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    //根據當前已授權使用者 抓所有的project
    async function fetchProject() {
      try {
        //https://docs.gitlab.com/ee/api/projects.html#list-user-projects
        const res = Axios.get(
          `https://gitlab.com/api/v4/users/${username}/projects`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        //抓取目前的gitlab project
        setCurrentProject(res.data.find(repo => repo.id == id));
      } catch (error) {
        //alert(error.response.status);
        console.error(error);
      }
    }
    fetchProject();
  }, []);

  useEffect(() => {
    async function fetchSelectedProject() {
      if (currentProject) {
        handleToggle();
        //抓取所有的merge request
        try {
          //https://docs.gitlab.com/ee/api/merge_requests.html#list-project-merge-requests
          const res = await Axios.get(
            `https://gitlab.com/api/v4/projects/${id}/merge_requests`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
          setMrListData(res.data);
          handleClose();
        } catch (error) {
          alert(error.response.status);
          console.error(error);
        }
      }
    }

    fetchSelectedProject();
  }, [currentProject, prop.startMonth, prop.endMonth]);

  useEffect(() => {
    const { endMonth } = prop;
    let chartDataset = { labels: [], data: { created: [], merged: [] } };
    let mrListDataSortedByCreatedAt = mrListData;
    let mrListDataSortedByMergedAt = mrListData;

    mrListDataSortedByCreatedAt.sort((a, b) => a.created_at - b.created_at);
    mrListDataSortedByMergedAt.sort((a, b) => a.merged_at - b.merged_at);

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
    console.log(chartDataset);
    setDataForMrChart(chartDataset);
  }, [mrListData]);

  return (
    <div style={{ marginLeft: '10px' }}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        {/* <ProjectAvatar size="small" project={currentProject} /> */}
        <p>
          <h2>{currentProject.name}</h2>
        </p>
      </div>
      <div className={classes.root}>
        <div style={{ width: '67%' }}>
          <div>
            <h1>Merge Request</h1>
            <div>
              <DrawingBoard
                data={dataForMrChart}
                color="skyblue"
                id="team-issue-chart"
                isIssue={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    endMonth: state.selectedMonth.endMonth,
  };
};

export default connect(mapStateToProps)(GitlabMergeRequestPage);
