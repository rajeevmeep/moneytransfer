﻿(function () {
    'use strict';
    angular
        .module('app')
        .controller('manageContectUsController', manageContectUsController)
        .controller('footerController', footerController)

    manageContectUsController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log', '$filter'];
    function manageContectUsController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log, $filter) {
        var vm = $scope;

        vm.CompanyId = 0;
        vm.CustomerId = 0;

        vm.ContactUsModal = { "Name": " ", "Email": "", "ReceivingCountry": "0", "FalconLoopTransactionNumber": " ", "Subject": "", "Question": "" };

        vm.RequestRefundModal = { "Name": " ", "Email": "", "ReceivingCountry": "0", "FalconLoopTransactionNumber": " ", "Subject": "", "Question": "" };

        //Get Country
        $http({
            method: 'GET',
            url: baseUrl + 'getcountrydetails',
            headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data) {
            var idata = data;
            vm.Countries = idata;
        });

        vm.Create = function (RequestNumber) {
            vm.Request = RequestNumber;
            var formData = '';
            if (RequestNumber == 1) {
                formData = JSON.parse(JSON.stringify(vm.ContactUsModal));
            }
            else {
                formData = JSON.parse(JSON.stringify(vm.RequestRefundModal));
            }
            $http({
                method: 'POST',
                url: baseUrl + 'getSendEmailTLS',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
            .success(function (data) {
                var idata = data;
                if (idata.Result == "Success") {
                    if (vm.Request == 1) {
                        vm.ContactUsModal = { "ReceivingCountry": "0" }
                        AlertKyc(1, "Thanks for contact us we will get back to you soon");
                    }
                    else {
                        vm.RequestRefundModal = { "ReceivingCountry": "0" }
                        AlertContact(1, "Your Request Refund processed successfully");
                    }
                }
                else {
                    if (vm.Request == 1) {
                        AlertKyc(2, idata.Error);
                    }
                    else { AlertContact(1, idata.Error); }
                }
            });
        }

        vm.CancelEmail = function () {
            vm.ContactUsModal = { "ReceivingCountry": "0" }
        }

        vm.CancelRequest = function () {
            vm.RequestRefundModal = { "ReceivingCountry": "0" }
        }

    }

    footerController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log', '$filter'];
    function footerController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log, $filter) {
        var vm = $scope;

        vm.footerModalEmail = '';

        vm.Create = function () {

            var formData = JSON.parse(JSON.stringify({ "Email": vm.footerModalEmail }));
            $http({
                method: 'POST',
                url: baseUrl + 'sendNewletterEmail',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
            .success(function (data) {
                var idata = data;
                if (idata.Result == "Success") {
                    vm.footerModalEmail = '';
                    AlertContact(1, "Thanks for subscribe news latter and alerts");
                }
                else {
                    AlertContact(1, idata.Error);
                }
            });
        }



    }

})();
