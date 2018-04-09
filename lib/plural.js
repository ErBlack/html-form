const plural = (function() {
    const FIELD_FORMS = ['поле', 'поля', 'полей'];
    const FIELDSET_FORMS = ['филдсет', 'филдсета', 'филдсетов'];
    const CHANGED_FORMS = ['изменено', 'изменены', 'изменено'];
    const VALID_FORMS = ['валидно', 'валидны', 'валидны'];

    function getText(number, forms) {
        const plural = (number % 10 == 1 && number % 100 != 11) ?
            0 :
            ((number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) ? 1 : 2);

        return forms[plural];
    }

    function messageFields(n) {
        return `${n} ${getText(n, FIELD_FORMS)}`;
    }

    function messageFieldsets(n) {
        return `${n} ${getText(n, FIELDSET_FORMS)}`;
    }

    function messageValid(n) {
        return getText(n, VALID_FORMS);
    }

    function messageChanged(n) {
        return getText(n, CHANGED_FORMS);
    }

    return {
        getText,
        messageFields,
        messageFieldsets,
        messageChanged,
        messageValid
    };
})();