import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProjectAvatar from './ProjectAvatar';
import DrawingBoard from './DrawingBoard';
import Axios from 'axios';
import moment from 'moment';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { countIssues } from './gitlab/issueUtils';

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

function GitlabIssuesPage(prop) {
  const classes = useStyles();
  const [issueListData, setIssueListData] = useState([]);
  const [dataForIssueChart, setDataForIssueChart] = useState({
    labels: [],
    data: { created: [], closed: [] },
  });

  const [currentProject, setCurrentProject] = useState({});

  const { access_token, username } = useSelector(state => state.oauth);
  const { id } = useParams();
  // const jwtToken = localStorage.getItem('jwtToken');

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
        //抓取所有的issue
        try {
          //https://docs.gitlab.com/ee/api/issues.html#list-project-issues
          const res = await Axios.get(
            `https://gitlab.com/api/v4/projects/${id}/issues`,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
          setIssueListData(res.data);
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

    let chartDataset = countIssues(issueListData, endMonth);

    setDataForIssueChart(chartDataset);
  }, [issueListData]);

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
            <h1>Team</h1>
            <div>
              <DrawingBoard
                data={dataForIssueChart}
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

export default connect(mapStateToProps)(GitlabIssuesPage);
