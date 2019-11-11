import sha256 from 'js-sha256';

export default {
    passwordHash: (password) => {
        var hash = sha256.create();
        hash.update(password);
        return hash.hex();
    },

    removeCharacter: (str_to_remove, str) => {
        let reg = new RegExp(str_to_remove)
        return str.replace(reg, '')
    }

}