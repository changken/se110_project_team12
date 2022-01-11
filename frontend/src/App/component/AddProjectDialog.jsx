import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState } from 'react';
import { SiGithub, SiGitlab, SiTrello, SiJenkins } from 'react-icons/si';
import { Add, Delete, Edit, MoreVert } from '@mui/icons-material';
import axios from 'axios';
import GitlabOauth from './GitlabOauth';

export default function AddProjectDialog({ open, reloadProjects, handleClose }) {
  const [gitlabShow, setGitlabShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [circularProgressIndex, setcircularProgressIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [anchorEl, setAnchorEl] = useState(false);
  const openMenu = Boolean(anchorEl);
  const [data, setData] = useState([]);
  const [selectCard, setSelectCard] = useState('');
  const loginData = [
    {
      text: 'GitHub Login',
      icon: <SiGithub />,
    },
    {
      text: 'GitLab Login',
      icon: <SiGitlab />,
    },
    {
      text: 'Trello Login',
      icon: <SiTrello />,
    },
    {
      text: 'Jenkins Login',
      icon: <SiJenkins />,
    },
  ];

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setSelectCard(event.currentTarget.id);
  };

  const handleEditName = () => {
    setAnchorEl(null);
    let text = prompt('請輸入修改的名稱', selectCard);
    let name;
    name = text === null || text === '' ? selectCard : text;

    let payload = {
      token: localStorage.getItem('token'),
      beforeName: selectCard,
      afterName: name,
    };

    axios
      .post('http://localhost:9100/pvs-api/oauth/github/repos/update', payload)
      .then((res) => {
        payload = {
          token: localStorage.getItem('token'),
        };
        axios.post('http://localhost:9100/pvs-api/oauth/github/repos', payload
        ).then((res) => {
          setData([])
          var response = res.data;
          let newData = [...data];
          for (var i = 0; i < response.length; i += 2) {
            newData.push(
              <List component={Stack} direction="row">
                <Card
                  sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                >
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        {response[i].name[0]}
                      </Avatar>
                    }
                    title={response[i].name}
                    action={
                      <IconButton
                        id={response[i].name}
                        onClick={handleClick}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                  ></CardHeader>
                  <CardContent>
                    {response[i].description ??
                      'No description, website, or topics provided.'}
                  </CardContent>
                  <Button id={response[i].html_url} variant="text" onClick={createProject}>選擇</Button>
                </Card>
                {i + 1 < response.length && (
                  <Card
                    sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe">
                          {response[i + 1].name[0]}
                        </Avatar>
                      }
                      title={response[i + 1].name}
                      action={
                        <IconButton
                          id={response[i + 1].name}
                          onClick={handleClick}
                        >
                          <MoreVert />
                        </IconButton>
                      }
                    ></CardHeader>
                    <CardContent>
                      {response[i + 1].description ??
                        'No description, website, or topics provided.'}
                    </CardContent>
                    <Button id={response[i].html_url} variant="text" onClick={createProject}>選擇</Button>
                  </Card>
                )}
              </List>
            )
          }
          setData(newData);
        }).catch(err => {
          console.log('err');
        })
      })
      .catch(err => {
        console.log('err');
      });
  };

  const handleDelete = () => {
    setAnchorEl(null);
    let payload = {
      token: localStorage.getItem('token'),
      name: selectCard
    };

    axios
      .post('http://localhost:9100/pvs-api/oauth/github/repos/delete', payload)
      .then((res) => {
        payload = {
          token: localStorage.getItem('token'),
        };
        axios.post('http://localhost:9100/pvs-api/oauth/github/repos', payload
        ).then((res) => {
          setData([])
          var response = res.data;
          let newData = [...data];
          for (var i = 0; i < response.length; i += 2) {
            newData.push(
              <List component={Stack} direction="row">
                <Card
                  sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                >
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        {response[i].name[0]}
                      </Avatar>
                    }
                    title={response[i].name}
                    action={
                      <IconButton
                        id={response[i].name}
                        onClick={handleClick}
                      >
                        <MoreVert />
                      </IconButton>
                    }
                  ></CardHeader>
                  <CardContent>
                    {response[i].description ??
                      'No description, website, or topics provided.'}
                  </CardContent>
                  <Button id={response[i].html_url} variant="text" onClick={createProject}>選擇</Button>
                </Card>
                {i + 1 < response.length && (
                  <Card
                    sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar aria-label="recipe">
                          {response[i + 1].name[0]}
                        </Avatar>
                      }
                      title={response[i + 1].name}
                      action={
                        <IconButton
                          id={response[i + 1].name}
                          onClick={handleClick}
                        >
                          <MoreVert />
                        </IconButton>
                      }
                    ></CardHeader>
                    <CardContent>
                      {response[i + 1].description ??
                        'No description, website, or topics provided.'}
                    </CardContent>
                    <Button id={response[i].html_url} variant="text" onClick={createProject}>選擇</Button>
                  </Card>
                )}
              </List>
            )
          }
          setData(newData);
        }).catch(err => {
          console.log('err');
        })
      })
      .catch(err => {
        console.log('err');
      });
  }

  const handleClosing = event => {
    setAnchorEl(null);
  };

  const createProject = event => {
    let payload = {
      projectName: projectName,
      githubRepositoryURL: event.currentTarget.id,
      sonarRepositoryURL: ""
    }
    axios.post("http://localhost:9100/pvs-api/project", payload
    ).then((res) => {
      reloadProjects()
      handleClose()
    }).catch((err) => {
      console.log("err");
    })
  }

  const handleLogin = index => {
    if (index >= 0 && index <= 4) {
      setStep(0);
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }

      if (index === 0) {
        setcircularProgressIndex(0);
        const githubClientId = '4c08f6a53bf874e1c230';
        var authWindow = window.open(
          `https://github.com/login/oauth/authorize/?client_id=${githubClientId}`,
          'WindowOpen1',
          'toolbar=Yes,location=Yes,directories=Yes,width=400,height=600'
        );
        var timer = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(timer);
            setSuccess(true);
            setLoading(false);
            setStep(1);
            let payload = {
              token: localStorage.getItem('token'),
            };
            axios
              .post('http://localhost:9100/pvs-api/oauth/github/repos', payload)
              .then(res => {
                var response = res.data;
                let newData = [...data];
                for (var i = 0; i < response.length; i += 2) {
                  newData.push(
                    <List component={Stack} direction="row">
                      <Card
                        sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar aria-label="recipe">
                              {response[i].name[0]}
                            </Avatar>
                          }
                          title={response[i].name}
                          action={
                            <IconButton
                              id={response[i].name}
                              onClick={handleClick}
                            >
                              <MoreVert />
                            </IconButton>
                          }
                        ></CardHeader>
                        <CardContent>
                          {response[i].description ??
                            'No description, website, or topics provided.'}
                        </CardContent>
                        <Button id={response[i].html_url} variant="text" onClick={createProject}>選擇</Button>
                      </Card>
                      {i + 1 < response.length && (
                        <Card
                          sx={{ width: 250, maxWidth: 400, overflow: 'scroll' }}
                        >
                          <CardHeader
                            avatar={
                              <Avatar aria-label="recipe">
                                {response[i + 1].name[0]}
                              </Avatar>
                            }
                            title={response[i + 1].name}
                            action={
                              <IconButton
                                id={response[i + 1].name}
                                onClick={handleClick}
                              >
                                <MoreVert />
                              </IconButton>
                            }
                          ></CardHeader>
                          <CardContent>
                            {response[i + 1].description ??
                              'No description, website, or topics provided.'}
                          </CardContent>
                          <Button id={response[i + 1].html_url} variant="text" onClick={createProject}>選擇</Button>
                        </Card>
                      )}
                    </List>
                  );
                }
                setData(newData);
              })
              .catch(err => {
                console.log('err');
              });
          }
        }, 1000);
      } else if (index === 1) {
        setcircularProgressIndex(1);
        setGitlabShow(true);
        setSuccess(true);
        setLoading(false);
        console.log('GitLab');
      } else if (index === 2) {
        setcircularProgressIndex(2);
        console.log('Trello');
      } else if (index === 3) {
        setcircularProgressIndex(3);
        console.log('Jenkins');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent style={{ overflow: 'auto' }}>
        <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
        {step === 0 && (
          <List>
            {loginData.map((val, idx) => {
              return (
                <ListItemButton onClick={() => handleLogin(idx)}>
                  <ListItemAvatar>
                    <Avatar>{val.icon}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={val.text} />
                  {loading && circularProgressIndex === idx && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        )}
        {step === 1 && (
          <Box>
            <Card>
              <CardActionArea>
                <IconButton color="primary" disabled>
                  <Add />
                </IconButton>
              </CardActionArea>
            </Card>
            {data}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleClosing}>
              <MenuItem onClick={handleEditName}>
                <Edit /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <Delete /> Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
        {gitlabShow ? <GitlabOauth /> : <></>}
      </DialogContent>
    </Dialog>
  );
}
