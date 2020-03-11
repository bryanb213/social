import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: '26c196bacea7db10cf48',
            clientSecret: '0885cb690e07d2a93a6afb0891fb552fd9f7aa53',
            count: 5,
            sort: 'created: asc',
            repos: []
        };
    }

    componentDidMount() {
        const { username } = this.props;
        const { count, sort, clientId, clientSecret } = this.state;

        fetch(
            `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
        )
            .then(res => res.json())
            .then(data => {
                
                    this.setState({ repos: data });
                    console.log(data)
            })
            .catch(err => console.log(err));
    }

    render() {
        const { repos } = this.state;

        const repoItems = repos.map(repo => (
            
                <div key={repo.id} className="repo bg-white p-1 my-1">
                    <div>
                        <h2>
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                {repo.name} 
                            </a>
                        </h2>
                        <p>{repo.description}</p>
                    </div>
                    <div>
                        <ul>
                            <li className="badge badge-primary">
                                Stars: {repo.stargazers_count}
                            </li>
                            <li className="badge badge-dark">
                                Watchers: {repo.watchers_count}
                            </li>
                            <li className="badge badge-light">
                                Forks: {repo.forks_count}
                            </li>
                        </ul>
                    </div>
                </div>
        ));
        if(repoItems){
            return (
                <div className="profile-github">
                    
                    {repoItems}
                    </div>
            );
        } else {
            return (
                <h1>ki</h1>
            )
        }
    }
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired
};

export default ProfileGithub;
