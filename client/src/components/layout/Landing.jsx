import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Landing = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Redirect to='/dashboard' />
    }
    return (
        <section class="landing">
            <div class="dark-overlay">
                <div class="landing-inner">
                    <h1 class="x-large">Developer Finder</h1>
                    <p class="lead">
                        Looking for a developer for your business? Come in and search hundreds of developers waiting to hear from you! Developers create/show off your skills by creating a profile and show off what you can do!
            </p>
                    <div class="buttons">
                        <Link to="/register" class="btn btn-primary">Sign Up</Link>
                        <Link to="/login" class="btn btn-light">Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing);
