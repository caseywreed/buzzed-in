'use strict';

angular.module('app').controller('questionCtrl', function ($scope, QuestionFactory) {

    $scope.questionDisplay = null
    $scope.userAnswer = ""
    $scope.answerAlert = false
    $scope.userScore = 0
    $scope.previousAnswer = ""
    $scope.previousAnswerFlag = null

    $scope.init = function () {
        $scope.getRandom()
    }

    $scope.submitAnswer = function (question) {
        // TO DO: More complex answer validation
        // Maybe grab some code from Slack's TrebekBot???
        $scope.answerAlert = false
        if ($scope.userAnswer == "" || $scope.userAnswer == null) {
            $scope.answerAlert = true;
            return
        }
        $scope.previousAnswer = question.answer;
        let x = question.answer.toUpperCase();
        let check = x.includes($scope.userAnswer.toUpperCase());
        if (check === true) {
            $scope.correctAnswer(question)
        } else {
            $scope.wrongAnswer(question)
        }
    }

    $scope.submitInvalid = function (id) {
        QuestionFactory.reportInvalidQuestion(id)
        $scope.getRandom();
    }

    $scope.correctAnswer = function (question) {
        $scope.previousAnswerFlag = true
        $scope.adjustUserScore(question.value)
        $scope.getRandom()
        $("#answerInput").val("")
        $scope.userAnswer = ""
    }

    $scope.wrongAnswer = function (question) {
        $scope.previousAnswerFlag = false
        $scope.adjustUserScore((question.value * -1))
        $scope.getRandom()
        $("#answerInput").val("")
        $scope.userAnswer = ""
    }

    $scope.adjustUserScore = function (int) {
        $scope.userScore += int
    }

    $scope.getRandom = function () {
        QuestionFactory.getRandomQuestion()
        .then(function (data) {
            $scope.answerFlag = false
            $scope.questionDisplay = []
            $scope.questionDisplay = data[0]
            $scope.questionDisplay.category.title = $scope.titleFormat($scope.questionDisplay.category.title)
            $scope.questionDisplay.answer = $scope.answerFormat($scope.questionDisplay.answer)
            // If the question doesn't exist on the response, get another question
            // If the question is marked as INVALID 2 or more times, get another question
            if ($scope.questionDisplay.question == "" || $scope.questionDisplay.invalid >= 2) {
                $scope.getRandom()
            }
        })
    }

    $scope.titleFormat = function (string) {
        let str = string.toLowerCase().split(' ');
        for(var i = 0; i < str.length; i++){
            str[i] = str[i].split('');
            // Checks to see whether the first char of a word is a parentheses or bracket
            if (str[i][0] != "(" && str[i][0] != "[" && str[i][0] != "\"" ) {
                str[i][0] = str[i][0].toUpperCase();
            } else {
                str[i][1] = str[i][1].toUpperCase();
            }
            str[i] = str[i].join('');
        }
        return str.join(' ');
    }

    $scope.answerFormat = function (string) {
        string.replace("<i>", "")
        string.replace("</i>", "")
        return string
    }

    $scope.twitterLink = function () {
        chrome.tabs.create({"url": "https://twitter.com/caseyreeddev"});
    }

    $scope.githubLink = function () {
        chrome.tabs.create({"url": "https://github.com/caseywreed"});
    }

});