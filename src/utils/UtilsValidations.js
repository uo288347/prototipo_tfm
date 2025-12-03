export let validateFormDataInputRequired =
    (formData, inputKey, formErrors, setFormErrors, errorMessage = "Required") => {

        let regexNotEmpty = /^(.+)$/;
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexNotEmpty, errorMessage)
    }


export let validateFormDataInputEmail =
    (formData, inputKey, formErrors, setFormErrors, errorMessage = "Not email format") => {

        let regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        return validateFormDataInput(
            formData, inputKey, formErrors, setFormErrors, regexEmail, errorMessage)
    }

export let validateFormDataInputYear =
    (formData, inputKey, formErrors, setFormErrors, errorMessageRequired = "Required", errorMessageFormat = "Must be a 4-digit year", errorMessageRange = "Year must be between 1926 and {currentYear}") => {
        if (formData[inputKey] == null) {
            return true
        }

        // First, check if the input is provided
        if (!validateFormDataInputRequired(formData, inputKey, formErrors, setFormErrors, errorMessageRequired)) {
            return false;
        }

        const value = formData[inputKey];
        const currentYear = new Date().getFullYear();
        const regexYear = /^\d{4}$/; // exactly 4 digits

        // If regex fails, set error
        if (!regexYear.test(value)) {
            if (!formErrors[inputKey]) {
                formErrors[inputKey] = { msg: errorMessageFormat };
                setFormErrors(formErrors);
            }
            return false;
        }

        const year = parseInt(value, 10);
        if (year <= 1925 || year >= currentYear) {
            if (!formErrors[inputKey]) {
                formErrors[inputKey] = { msg: errorMessageRange.replace("{year}", currentYear - 1) };
                setFormErrors(formErrors);
            }
            return false;
        }

        // Passed all checks, clear any previous client errors
        if (formErrors[inputKey]) {
            formErrors[inputKey] = null;
            setFormErrors(formErrors);
        }

        return true;
    }


export let validateFormDataInput =
    (formData, inputKey, formErrors, setFormErrors, regex, msgError) => {
        // not write Yet
        if (formData[inputKey] == null) {
            return true
        }

        // have a serverError
        if (formErrors[inputKey]?.type == "server") {
            return false
        }


        // Have some value, remove the error only client erros
        if (formData[inputKey] != null && regex.test(formData[inputKey])) {
            if (formErrors[inputKey] != null ) {
                formErrors[inputKey] = null;
                setFormErrors(formErrors)
                // don't put again the value in state
            }
            return true;
        }

        // Dont have value put the error
        if (formErrors[inputKey] == null) {
            formErrors[inputKey] = {msg: msgError }
            setFormErrors(formErrors)
        }
        return false;
    }

export let allowSubmitForm = (formData, formErrors, requiredInputWithNoErrors) => {
    let result = true;
    requiredInputWithNoErrors.forEach(inputKey => {
        // With client errors you cant not submit form
        if (formData[inputKey] == null
            || formErrors[inputKey] != null ) {

            result = false;
            return;
        }
    })
    return result;
}

export let setServerErrors = (serverErrors, setFormErrors) => {
    let newFormErrors = {} //delete all previous
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            newFormErrors[e.field] = { msg: e.msg, type: "server" }
        });
    }
    // destroy all previous errors is a new SET
    setFormErrors(newFormErrors)
}

export let joinAllServerErrorMessages = (serverErrors) => {
    let generalErrorMessage = "";
    if ( Array.isArray(serverErrors)){
        serverErrors.forEach(e => {
            generalErrorMessage += e.msg
        });
    } else {
        if (serverErrors?.msg != null){
            generalErrorMessage = serverErrors.msg;
        }
    }
    return generalErrorMessage
}

