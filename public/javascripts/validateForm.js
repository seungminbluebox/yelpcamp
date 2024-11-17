//public/validateForm.js

(() => {
    'use strict'

    const forms = document.querySelectorAll('.validated-form') //클래스 이름
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})