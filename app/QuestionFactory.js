'use strict';

angular.module('app').factory("QuestionFactory", function ($q, $http) {

    const getRandomQuestion = function () {
        return $q((resolve,reject) => {
            $http.get("http://jservice.io/api/random?count=1")
            .success((data) => {
                console.log(data)
                resolve(data)
            })
            .error((error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    const reportInvalidQuestion = function (id) {
        return $q((resolve,reject) => {
            $http.post("http://jservice.io/api/random?id=${id}")
            .success((data) => {
                console.log(data)
                resolve(data)
            })
            .error((error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    return {getRandomQuestion, reportInvalidQuestion}

})