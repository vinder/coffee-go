module.exports = function() {
    return [{
        "request": {
            "method": "POST",
            "url": "http://powerful-sierra-2165.herokuapp.com/api/v1/person/1234567/brew/coffee",
        },
        "response": {
            "code": 200,
            "data": {
                "brew": {
                    "beverage": "coffee",
                    "person": "1234567",
                    "status": "brewing"
                }
            }
        }

    }];
};
