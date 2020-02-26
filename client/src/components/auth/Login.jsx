import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
    const { email, password } = formData;

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
    };

    //redirect if logged in
        if(isAuthenticated){
            return <Redirect to='/dashboard' />
        }

    return (
        <Fragment>
                <h1 class="large text-primary">Sign In</h1>
                <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
                <form class="form" onSubmit={e => onSubmit(e)}>
                    <div class="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                    <div class="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={e => onChange(e)}
                            value={password}
                        />
                    </div>
                    <input type="submit" class="btn btn-primary" value="Login" />
                </form>
                <p class="my-1">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
        </Fragment>
    );
}
Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
