import sha256 from 'js-sha256';

export default {
    passwordHash(password){
        var hash = sha256.create();
        hash.update(password);
        return hash.hex();
    }
}