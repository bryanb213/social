import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/spinner'
import {  Link } from 'react-router-dom';
import DashboardActions from './DashboardActions.jsx';
import Experience from './Experience';
import Education from './Education'



const Dashboard = ({ deleteAccount, getCurrentProfile, auth: { user }, profile: { loading, profile } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return (
        loading && profile === null ? <Spinner /> : <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
            <i className="fas fa-user"></i> Welcome { user && user.name }
            </p>
            {profile !== null ? <Fragment>
                <DashboardActions />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />
                <div className="my-2">
                    <button className="btn btn-danger">
                        <i className="fas fas-user-minus"></i>
                         Delete my account
                    </button>
                </div>
            </Fragment> : 
            <Fragment>
                <p>You have not set up a profile yet, please add some info</p>
                <Link to='create-profile' className="btn btn-primary my-1" >Create Profile</Link>
            </Fragment>}
        </Fragment>
    )
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
