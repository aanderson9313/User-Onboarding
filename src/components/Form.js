import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import "./Form.css";

const NewUser = ({values, errors, touched, status }) => {

    const [user, setUser] = useState([]);

    useEffect(() => {
        if (status) {
            setUser([...user, status])
        }
    }, [status]);

    return(
        <div className = "newUserForm">
            <Form>
                <label className = "input">Name:</label>
                <Field className = "input" type = "text" name = "name" placeholder = "Name" />
                {touched.name && errors.name && (<p className = "error">{errors.name}</p>)}

                <label className = "input">Email:</label>
                <Field className = "input" type = "email" name = "email" placeholder = "Email"/>
                {touched.email && errors.email && (<p className = "error">{errors.email}</p>)}

                <label className = "input">Password:</label>
                <Field className = "input" type = "password" name = "password" placeholder = "********"/>
                {touched.password && errors.password && (<p className = "error">{errors.password}</p>)}

                <label className = "check">Agree to Terms of Services: <Field className = "check" type = "checkbox" name = "terms" checked = {values.terms} /></label>
                {touched.terms && errors.terms && (<p className = "error">{errors.terms}</p>)}

                <button className = "button" type = "submit">Submit</button>
            </Form>
            {/* Prints user info after submission */}
            {user.map(person => (
                <ul className = "list" key={person.id}>
                    <li>Name: {person.name}</li>
                    <li>Email: {person.email}</li>
                    <li>Password: {"*".repeat(person.password.length)}</li>
                </ul>
            ))}


        </div>
    )}

const FormikNewUser = withFormik({
    mapPropsToValues({name, email, password, terms}) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            terms: terms || false
        };
    
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().min(3, "Name must have more than two characters.").required("Required field."),
        email: Yup.string().email("Email is not a valid email.").required("Required field."),
        password: Yup.string().min(5, "Password must have at least 5 characters.").required("Required field."),
        terms: Yup.boolean().oneOf([true], "Must accept Terms of Service.").required()
    }),

    handleSubmit(values, {setStatus}) {
        axios
            .post("https://reqres.in/api/users/", values)
            .then(response =>{
                console.log(response);
                setStatus(response.data);
            })
            .catch(error => console.log(error.response));
    }
})(NewUser)

export default FormikNewUser;