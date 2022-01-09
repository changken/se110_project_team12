import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProjectAvatar from './ProjectAvatar';
import DrawingBoard from './DrawingBoard';
import Axios from 'axios';
import moment from 'moment';
import {
  CircularProgress,
  Backdrop,
  Select,
  MenuItem,
} from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

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

function GitlabCommitsPage(prop) {
  const classes = useStyles();
  const [commitListData, setCommitListData] = useState([]);
  const [dataForTeamCommitChart, setDataForTeamCommitChart] = useState({
    labels: [],
    data: { team: [] },
  });
  const [dataForMemberCommitChart, setDataForMemberCommitChart] = useState({
    labels: [],
    data: {},
  });
  const [currentProject, setCurrentProject] = useState({});

  const [numberOfMember, setNumberOfMember] = useState(5);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const { id } = useParams();
  // const jwtToken = localStorage.getItem('jwtToken');
  const { access_token, username } = useSelector(state => state.oauth);

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
        //抓取所有的commit
        try {
          //https://docs.gitlab.com/ee/api/commits.html#list-repository-commits
          const res = await Axios.get(
            `https://gitlab.com/api/v4/projects/${id}/repository/commits`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
          setCommitListData(res.data);
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
    const { startMonth, endMonth } = prop;

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

    setDataForTeamCommitChart(chartDataset);
  }, [commitListData, prop.startMonth, prop.endMonth]);

  useEffect(() => {
    const { startMonth, endMonth } = prop;

    let chartDataset = {
      labels: [],
      data: {},
    };
    new Set(commitListData.map(commit => commit.author_name)).forEach(
      author => {
        chartDataset.data[author] = [];
      }
    );
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
    setDataForMemberCommitChart(chartDataset);
  }, [commitListData, prop.startMonth, prop.endMonth, numberOfMember]);

  if (!id) {
    return <Redirect to="/select" />;
  }

  return (
    <div style={{ marginLeft: '10px' }}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.root}>
        {/* <ProjectAvatar size="small" project={currentProject} /> */}
        <p>
          <h2>{currentProject ? currentProject.name : ''}</h2>
        </p>
      </div>
      <div className={classes.root}>
        <div style={{ width: '67%' }}>
          <div>
            <h1>Team</h1>
            <div>
              <DrawingBoard
                data={dataForTeamCommitChart}
                id="team-commit-chart"
              />
            </div>
            <div className={classes.root}>
              <h1>Member</h1>
              <Select
                labelId="number-of-member-label"
                id="number-of-member"
                value={numberOfMember}
                onChange={e => setNumberOfMember(e.target.value)}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={15}>15</MenuItem>
              </Select>
            </div>
            <div>
              <DrawingBoard
                data={dataForMemberCommitChart}
                id="member-commit-chart"
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
    startMonth: state.selectedMonth.startMonth,
    endMonth: state.selectedMonth.endMonth,
  };
};

export default connect(mapStateToProps)(GitlabCommitsPage);
