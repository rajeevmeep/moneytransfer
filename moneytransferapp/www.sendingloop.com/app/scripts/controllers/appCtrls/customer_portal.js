﻿(function () {
    'use strict';
    angular
        .module('app')
        .controller('manageGustCustomerController', manageGustCustomerController)
        .controller('manageGuestCustomerTransactionController', manageGuestCustomerTransactionController)
        .controller('manageMakePaymentController', manageMakePaymentController)
         .controller('manageCustomerLoginController', manageCustomerLoginController)
         .controller('customerPortalthankyouController', customerPortalthankyouController)
         .controller('authenticateGuestController', authenticateGuestController)
         .controller('addEditkycController', addEditkycController)

    manageGustCustomerController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log', '$filter'];
    function manageGustCustomerController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log, $filter) {
        var vm = $scope;

        vm.CompanyId = 0;
        vm.CustomerId = 0;
        vm.CustomerName = '';
        vm.CurrencyData = [];
        vm.feeData = [];
        vm.Fee = "";
        vm.DestinationCountry = "";
        // remove default
        vm.isPayAmmount = false;
        vm.isAmmount = false;
        vm.Amount = "";
        $('.modal-backdrop').remove();
        vm.FlagModel = [{ countryCode: '', internationalCodes: '', carrierName: '', Result: '' }];
        vm.localStorage = [{ GustData: '', GustCustomer: 0, SelectedCountry: '' }];
        // vm.PaybillModel = { CompanyId: 0, CustomerId: 0, SenderName: '', PaymentMethodId: '0', Amount: '0.00', MobileNumber: '' }
        vm.fare_amount = "";
        if ($localStorage.GustData) {
            vm.localStorage = $localStorage.GustData;
            vm.localStorage = $localStorage;

            if (vm.localStorage.GustData != '') {
                if (vm.localStorage.SelectedCountry) {
                    // vm.PaybillModel.MobileNumber = vm.localStorage.SelectedCountry.MobileNumber;
                    vm.FlagModel.countryCode = vm.localStorage.SelectedCountry.countryCode;
                    vm.FlagModel.internationalCodes = vm.localStorage.SelectedCountry.internationalCodes;
                    vm.FlagModel.carrierName = vm.localStorage.SelectedCountry.carrierName;
                    vm.FlagModel.Result = 'Success';
                }
            }
        } else {
            if (vm.localStorage.SelectedCountry) {
                $localStorage.SelectedCountry = [];
            }
            else { $state.go('customerPortal') }
        }

        if ($localStorage.GustCustomer) {
            vm.CustomerID = $localStorage.GustCustomer.CustomerId;
            vm.CompanyId = $localStorage.GustCustomer.CompanyId;
            GetCustomerTransactionDetails(vm.CustomerID, vm.CompanyId);
        }

        //====================Get Country====================//
        $http({
            method: 'GET',
            url: baseUrl + 'getcountrydetails',
            headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data) {
            var idata = data;
            vm.Countries = idata;

        });
        //====================End======================//


        //====================Get Selected Country Details====================//
        vm.CountryDetails = [{ phonecode: '' }];

        vm.PaybillModel = { CompanyId: 0, CustomerId: 0, SenderName: '', PaymentMethodId: '0', Amount: '0.00', MobileNumber: '' }

        vm.FlagModel = [];
        vm.getnumber = false;
        vm.getcountrydata = function (id) {

            var iCountryId = parseInt(id);
            var data1 = $filter('filter')(vm.Countries, {
                phonecode: iCountryId,
            }, true);
            vm.DestinationCountry = data1[0].CountryId;

            var skillsSelect = document.getElementById("CountrySelected");
            var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;

            var formData = JSON.parse(JSON.stringify({ "phonecode": iCountryId, "CountryName": selectedText }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getcountryByPhoneCode',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                if (idata.CountryCode != '') {
                    vm.PaybillModel.MobileNumber = '';
                    vm.FlagModel.countryCode = idata.iso.toLowerCase();
                    vm.FlagModel.internationalCodes = idata.phonecode;
                    vm.FlagModel.carrierName = idata.CountryName;

                    vm.FlagModel.Result = 'Success';
                }
                else {
                    vm.FlagModel = [];
                    $localStorage.GustData = '';
                    vm.FlagModel.Result = 'Failed';
                    //Alert(2, "!" + idata.Error);
                    setTimeout(function () {
                        $("#AlertText").text(idata.Error);
                    }, 100);
                }
            });
        }

        var timeout;
        var delay = 500;
        vm.EnteredNumber = function () {
            vm.validnumber = false;
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                Searchdata();
            }, delay);
        }
        //====================End======================//

        //====================Get Country Details By Number====================//
        function Searchdata() {
            $localStorage.GustData = '';
            var iCountryCode = vm.FlagModel.internationalCodes;
            var iNumber = vm.PaybillModel.MobileNumber;
            if (iNumber.length > 9) {

                if (iCountryCode) {
                    var iEnteredNumber = parseInt(iCountryCode + iNumber);
                }
                else {
                    var iEnteredNumber = parseInt(iNumber);
                }
                //===========Check to use service
                //if (true) {
                //    GetDetailsByPrenation(iEnteredNumber);
                //}
                //else {
                GetDetailsByTransferTo(iNumber, iEnteredNumber);
                //}
            }
            else {
                //vm.FlagModel = [];
                $localStorage.GustData = '';
            }

        }

        //=============================PreNations==================================//

        function GetDetailsByPrenation(iNumber) {

            var formData = JSON.parse(JSON.stringify({ "MobileNumber": iNumber }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getCarrierInfoByMobileNumber ',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                if (idata.countryCode != null) {
                    var SelectedCountry = [];
                    vm.PaybillModel.MobileNumber = iNumber;
                    if (!iCountryCode) {
                        if (idata.currencyCode == "MXN") {
                            var res = idata.internationalCodes;
                            var codelength = res;
                            idata.internationalCodes = res;
                            $localStorage.GustData = idata.MobileNumber.replace(/\D/g, '').substr(codelength);
                            vm.PaybillModel.MobileNumber = $localStorage.GustData;
                        }
                        else {
                            var codelength = idata.internationalCodes.length;
                            $localStorage.GustData = idata.MobileNumber.replace(/\D/g, '').substr(codelength);
                            vm.PaybillModel.MobileNumber = $localStorage.GustData;
                        }
                    }
                    else {
                        $localStorage.GustData = iNumber;
                        vm.PaybillModel.MobileNumber = iNumber;
                    }
                    idata.countryCode = idata.countryCode.toLowerCase();
                    vm.FlagModel = idata;
                    var sData = vm.CountryDetails;
                    if (!vm.DestinationCountry)

                        var PhoneCode = '';
                    if (idata.currencyCode == "MXN") {
                        PhoneCode = res;
                    }
                    else {
                        PhoneCode = idata.internationalCodes;
                    }
                    //var PhoneCode = '';
                    if (vm.CountryDetails.phonecode != '0') {
                        if (idata.internationalCodes != vm.CountryDetails.phonecode) {
                            vm.CountryDetails.phonecode = '0';
                        }
                        if (idata.currencyCode == "MXN") {
                            var res = idata.internationalCodes;
                            vm.CountryDetails.phonecode = res;

                            idata.internationalCodes = res;
                        }
                        else {
                            vm.CountryDetails.phonecode = idata.internationalCodes;
                        }
                    }

                    else {
                        if (idata.currencyCode == "MXN") {
                            var res = idata.internationalCodes;
                            vm.CountryDetails.phonecode = res;
                            idata.internationalCodes = res;
                        }
                        else {
                            vm.CountryDetails.phonecode = idata.internationalCodes;
                        }//vm.CountryDetails = sData;
                    }

                    $localStorage.SelectedCountry = idata;

                    if (idata.currencyCode == "USD") {
                        $localStorage.SelectedCountry.ConvertAmount = 1.00;
                        $localStorage.SelectedCountry.GlobalExchangesRate = 1.00;
                        $localStorage.SelectedCountry.DestinationCountry = "" + vm.DestinationCountry;
                    }
                    else { ConvertMoney(idata.currencyCode); }


                    if (!vm.DestinationCountry) {
                        var iCountryId = parseInt(PhoneCode);
                        var data1 = $filter('filter')(vm.Countries, {
                            phonecode: iCountryId,
                        }, true);
                        vm.DestinationCountry = data1[0].CountryId;

                    }
                    $localStorage.SelectedCountry.DestinationCountry = "" + vm.DestinationCountry;
                    setAmountArray();
                    vm.getnumber = true;
                }
                else {
                    //vm.FlagModel = [];
                    //vm.CountryDetails.phonecode = '0';
                    $localStorage.GustData = '';
                    //$localStorage.SelectedCountry = '';

                    vm.validnumber = true;
                    setTimeout(function () {
                        $("#AlertText").text("Sorry, the mobile network is not supported or the number is incorrect. Please check and try again.");
                    }, 100);
                }
            });
        }

        function GetDetailsByTransferTo(iEnterdN, iNumber) {
            //getMsisdnInfo
            var iCountryCode = vm.FlagModel.internationalCodes;
            var formData = JSON.parse(JSON.stringify({ "MobileNumber": iNumber }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getMsisdnInfo ',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
             .success(function (data) {

                 var idata = data;
                 if (idata.CountryId != null) {
                     var SelectedCountry = [];
                     vm.PaybillModel.MobileNumber = iEnterdN;

                     var sCountryName = idata.Country;
                     var CountryData = $filter('filter')(vm.Countries, {
                         CountryName: sCountryName,
                     }, true);

                     vm.CountryDetails.phonecode = "" + CountryData[0].phonecode;

                     vm.FlagModel.countryCode = CountryData[0].iso.toLowerCase();
                     vm.FlagModel.internationalCodes = CountryData[0].phonecode;
                     vm.FlagModel.carrierName = idata.Operator;
                     vm.FlagModel.Result = 'Success';



                     var codelength = (vm.CountryDetails.phonecode).toString().length;
                     $localStorage.GustData = idata.MobileNumber.replace(/\D/g, '').substr(codelength);
                     vm.PaybillModel.MobileNumber = $localStorage.GustData;
                     $localStorage.SelectedCountry = idata;
                     if (idata.DestinationCurrency == "USD") {
                         $localStorage.SelectedCountry.ConvertAmount = 1.00;
                         $localStorage.SelectedCountry.GlobalExchangesRate = 1.00;
                         $localStorage.SelectedCountry.DestinationCountry = "" + vm.DestinationCountry;
                     }
                     else {
                         vm.PayAmountList = [];
                         var AmmoutList = idata.LocalInfoValueList.split(',');
                         var j = 0;
                         angular.forEach(AmmoutList, function (value, key) {
                             var amt = value;
                             j += 1
                             var accesstoken = 'rxv51rk8b4y1kjhasvww';
                             $http({
                                 url: 'https://currencydatafeed.com/api/converter.php?' + $.param({ token: accesstoken, from: idata.DestinationCurrency, to: "USD", amount: value }),
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 dataType: "json",
                             })
                                 .success(function (data) {

                                     var idata = data;
                                     if (idata.currency[0].value > 0) {
                                         var value = parseFloat(idata.currency[0].value).toFixed(2)

                                         vm.PayAmountList.push({ AmountId: j += 1, Amount: parseInt(amt), AmtUsd: value });
                                     }
                                     else {
                                         vm.PayAmountList.push({ AmountId: j += 1, Amount: parseInt(amt) });
                                     }
                                 });
                         });
                         $localStorage.AmountList = vm.PayAmountList;
                     }
                    
                     //if (!vm.DestinationCountry) {
                         var sCountryName = idata.Country;
                         var CountryData = $filter('filter')(vm.Countries, {
                             CountryName: sCountryName,
                         }, true);
                         vm.DestinationCountry = CountryData[0].phonecode;

                         $localStorage.SelectedCountry.countryCode = CountryData[0].iso.toLowerCase();
                         $localStorage.SelectedCountry.internationalCodes = CountryData[0].phonecode;
                         $localStorage.SelectedCountry.GlobalExchangesRate = 1.00;
                         $localStorage.SelectedCountry.currencyCode = idata.DestinationCurrency
                         $localStorage.SelectedCountry.Result = 'Success';
                    // }


                     $localStorage.SelectedCountry.DestinationCountry = "" + vm.DestinationCountry;

                     vm.getnumber = true;


                 }
                 else {
                     $localStorage.GustData = '';
                     vm.validnumber = true;
                     setTimeout(function () {
                         $("#AlertText").text("Sorry, the mobile network is not supported or the number is incorrect. Please check and try again.");
                     }, 100);
                 }

             });
        }


        //=============================End==================================//

        //===========================Proceed to choose Amount===============//
        vm.submitForm = function () {
            if ($localStorage.GustData) {
                if ($localStorage.GustCustomer == '') {
                    vm.localStorage.GustCustomer = $localStorage.GustCustomer = 0;
                }
                $state.go('chooseAmount');
            }
            //else {
            //    Alert(2, "! It is not possible to recharge on this phone number. Please check the number and try again.");
            //}
        }
        //============================End==============================//

        //=========================Set Selected Amount=================//
        vm.selectAmmount = function (ammount) {

            var dAmount = parseFloat(ammount).toFixed(2)
            //amountfeild
            $('#amountfeild').val(dAmount);
            $localStorage.Ammount = dAmount;
            // $localStorage.AmountGer = 0;
            vm.getFeeDetails();
            vm.isPayAmmount = true;

            vm.isAmmount = false;
            //vm.PaybillModel.Amount = ammount; * $localStorage.SelectedCountry.ConvertAmount

            $('#proceedButton').prop('disabled', false);
        }

        //selectTransferToAmmount
        //============================End==============================//


        //=======================Validate Amount=======================//
        vm.checkPayAmmount = function (Ammount) {
            vm.accessAmount = false;
            vm.isPayAmmount = false;
            if (Ammount <= 100) {
                if (Ammount != null) {
                    if (Ammount) {
                        vm.isAmmount = true;
                        $localStorage.Ammount = Ammount;
                        vm.getFeeDetails();
                        $('#proceedButton').prop('disabled', false);
                    } else {
                        vm.isAmmount = false;
                        $localStorage.Ammount = "";
                        $('#proceedButton').prop('disabled', false);
                    }
                } else {
                    vm.isAmmount = false;
                    $('#proceedButton').prop('disabled', false);
                    return 0;
                }
            }
            else {
                vm.accessAmount = true;
                vm.isAmmount = false;
                $('#proceedButton').prop('disabled', true);
            }
        }
        //============================End==============================//



        //=================Set Global exchanges rate===================//
        vm.selectTransferToAmmount = function (ammount, usd) {
            var dAmount = parseFloat(usd).toFixed(2)
            //amountfeild
            $('#amountfeild').val(dAmount);
            $localStorage.Ammount = ammount;
            $localStorage.ReloadAmount = dAmount;

            vm.getFeeDetails();
            vm.isPayAmmount = false;

            vm.isAmmount = true;
            //vm.PaybillModel.Amount = ammount; * $localStorage.SelectedCountry.ConvertAmount

            $('#proceedButton').prop('disabled', false);
        }
        //============================End==============================//

        //=====================Get Fee details =======================//
        vm.getFeeDetails = function () {
            var DestinationCountry = vm.localStorage.SelectedCountry.DestinationCountry;
            var formData = JSON.parse(JSON.stringify({ "CompanyId": 17, "DestinationCountry": DestinationCountry }));
            $http({
                method: 'POST',
                url: baseUrl + 'getPaymentFeesByCompanydestinationCountry',
                data: formData,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                vm.feeData = idata;
                //var FareAmount = vm.localStorage.Ammount * vm.localStorage.SelectedCountry.ConvertAmount;
                var FareAmount = vm.localStorage.Ammount;
                for (var i = 0; i < vm.feeData.length; i++) {
                    if (FareAmount <= vm.feeData[i].EndAmount) {
                        vm.Fee = vm.feeData[i].Fees;
                    } else {
                        vm.Fee = 0
                    }
                }
            });
        }
        //============================End==============================//

        //=====================Validate amount to Proceed =======================//

        vm.proceed = function () {
            vm.accessAmount = false;
            vm.validAmount = false;
            vm.IstransferTo = false;
            if ($("#from_id").valid()) {
                if ($localStorage.Ammount) {
                    var fareAmmount = 0;
                    //fareAmmount = parseFloat($localStorage.Ammount * $localStorage.SelectedCountry.ConvertAmount);
                    var minAmount = parseInt($localStorage.SelectedCountry.minAmount);
                    var maxAmount = parseInt($localStorage.SelectedCountry.maxAmount);
                    fareAmmount = parseFloat($localStorage.Ammount);
                    vm.IstransferTo = true;
                    if (vm.IstransferTo) {
                        fareAmmount = parseFloat($localStorage.ReloadAmount);
                        $localStorage.FareAmmount = fareAmmount;
                        $localStorage.Fees = vm.Fee;
                        setTimeout(function () {
                            $state.go('reviewAmmount');
                        }, 100);
                    }
                    else {
                        if (fareAmmount <= maxAmount && fareAmmount >= minAmount) {


                            $localStorage.FareAmmount = fareAmmount;
                            $localStorage.Fees = vm.Fee;
                            setTimeout(function () {
                                $state.go('reviewAmmount');
                            }, 100);
                        }
                        else {
                            vm.accessAmount = true;
                        }
                    }

                }
                else {

                    vm.validAmount = true;
                    return 0;
                }
            } else {

                vm.validAmount = true;
                return 0;
            }


        }

        vm.popupYes = function () {
            $('#Payconfirm').modal('toggle');
            $('.modal-backdrop').remove();
            if (!$localStorage.GustCustomer) {
                $state.go('Login');
            } else {

                if (!$localStorage.GustCustomer.IsDocumentUpload) {
                    vm.TotalPaidAmt = $localStorage.GustCustomer.TotalTransactionsAmt;
                    vm.WeekTransactions = $localStorage.GustCustomer.TotalTransactionsInWeek;
                    vm.CurrentTransactions = $localStorage.GustCustomer.CurrentMonthTransactionCount;
                    vm.PreviousTransactions = $localStorage.GustCustomer.PreviousMonthTransactionCount;
                    vm.PrevioustoPreviousTransactions = $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount;
                    if (isNaN(vm.TotalPaidAmt)) { vm.TotalPaidAmt = 0; }

                    if (vm.CurrentTransactions <= 0 && vm.PreviousTransactions <= 1 && vm.PrevioustoPreviousTransactions <= 1) {
                        $window.location.assign('#makePayment');
                    }
                    else if (vm.WeekTransactions < 3) {
                        if ((parseFloat(vm.TotalPaidAmt) + parseFloat($localStorage.FareAmmount)) > 100) {
                            $('#KycConfrimation').modal('toggle');
                        }
                        else { $window.location.assign('/makePayment'); }
                    }
                    else { $('#KycConfrimation').modal('toggle'); }
                    //}
                    //else { $('#KycConfrimation').modal('toggle'); }
                }
                else {
                    $window.location.assign('/makePayment');
                    //$state.go('makePayment');
                }
            }
        }

        //================================End==================================//

        //=====================Proceed to submit KYC =========================//
        vm.YesKyc = function () {
            $('#KycConfrimation').modal('toggle');
            $('.modal-backdrop').remove();
            setTimeout(function () {
                $state.go('addKyc');
            }, 500);
        }

        if ($localStorage.Ammount) {

            var dAmount = parseFloat($localStorage.Ammount).toFixed(2)
            $('#amountfeild').val(dAmount);

        }
        //===============================End================================//

        vm.BackChooseamount = function () {
            if ($localStorage.Ammount) {
                $localStorage.Ammount = '';
                $state.go('chooseAmount');
            }
            else { $state.go('chooseAmount'); }

        }

        //With Exchange rate
        vm.PayAmountWithExchange = [{ AmountId: '1', Amount: '1.00' }, { AmountId: '2', Amount: '2.00' }, { AmountId: '3', Amount: '3.00' }, { AmountId: '4', Amount: '4.00' }, { AmountId: '5', Amount: '5.00' }, { AmountId: '6', Amount: '6.00' }, { AmountId: '7', Amount: '7.00' }, { AmountId: '8', Amount: '8.00' }, { AmountId: '9', Amount: '9.00' }, { AmountId: '10', Amount: '10.00' }, { AmountId: '11', Amount: '11.00' }, { AmountId: '12', Amount: '12.00' }];

        //==========================Set amount Array======================//
        function setAmountArray() {

            if ($localStorage.SelectedCountry.minAmount == $localStorage.SelectedCountry.maxAmount) {
                vm.PayAmountList = [{ AmountId: '1', Amount: $localStorage.SelectedCountry.minAmount }];
            }
            else {
                var iAmount = 0;
                vm.PayAmountList = [];
                var j = 0;
                var amt = parseInt($localStorage.SelectedCountry.minAmount);
                var i = parseInt($localStorage.SelectedCountry.minAmount);
                var Total = parseInt($localStorage.SelectedCountry.maxAmount);
                for (i; i <= Total; i += 5) {
                    if (i == parseInt($localStorage.SelectedCountry.minAmount)) {
                        vm.PayAmountList.push({ AmountId: 0, Amount: parseInt($localStorage.SelectedCountry.minAmount) });
                    }
                    else {
                        amt += 5;
                        vm.PayAmountList.push({ AmountId: j += 1, Amount: amt });
                    }

                }
            }
            $localStorage.AmountList = vm.PayAmountList;
        }
        //===============================End=============================//
        vm.goBack = function () {
            vm.localStorage.Ammount = '';
            vm.localStorage.AmountGer = '';
            vm.localStorage.FareAmmount = '';
            vm.localStorage.GustData = '';
            vm.localStorage.MobileNumber = '';
            vm.localStorage.SelectedCountry = '';
            $localStorage.ThankyouPageData = '';
            $localStorage.AmountList = '';
            // $state.go('customerPortal');

            setTimeout(function () {
                $window.location.reload();
                //$state.go('customerPortal');
            }, 1000);
        }

        vm.cancel = function () {
            vm.localStorage.Ammount = '';
            vm.localStorage.AmountGer = '';
            vm.localStorage.FareAmmount = '';
            vm.localStorage.GustData = '';
            vm.localStorage.MobileNumber = '';
            vm.localStorage.SelectedCountry = '';
            $localStorage.ThankyouPageData = '';
            $localStorage.AmountList = '';
            $state.go('customerPortal');
        }

        vm.logoutGustCustomer = function () {

            if ($localStorage.GustCustomer) {
                vm.localStorage.Ammount = '';
                vm.localStorage.AmountGer = '';
                vm.localStorage.FareAmmount = '';
                vm.localStorage.GustData = '';
                vm.localStorage.MobileNumber = '';
                vm.localStorage.SelectedCountry = '';
                vm.localStorage.GustCustomer = '';
                $localStorage.GustData = '';
                $localStorage.GustCustomer = '';
                $localStorage.ThankyouPageData = '';
                $localStorage.AmountList = '';
                $localStorage = [];
                setTimeout(function () {
                    //$state.go('customerPortal');
                    $window.location.reload();
                }, 1000);
            }
        }

        //Format date
        $scope.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        };

        //==========================Money Conversion======================//
        function ConvertMoney(code) {
            //$localStorage.SelectedCountry.ConvertAmount = 0;

            var accesstoken = 'rxv51rk8b4y1kjhasvww';
            $http({
                url: 'https://currencydatafeed.com/api/converter.php?' + $.param({ token: accesstoken, from: "USD", to: code, amount: "1" }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
                .success(function (data) {

                    var idata = data;
                    if (idata.currency[0].value > 0) {
                        var value = parseFloat(idata.currency[0].value).toFixed(2)
                        //var newvalu = value
                        $localStorage.SelectedCountry.ConvertAmount = value;
                        var DestinationCountryId = "";
                        var SellSpotPrice = value;
                        var data1 = $filter('filter')(vm.Countries, {
                            CurrencyCode: code,
                        }, true);
                        if (data1.length > 0) {
                            DestinationCountryId = data1[0].CountryId;
                        }

                        UpdateglobalExchange(code);
                    }
                    else {
                        $localStorage.SelectedCountry.ConvertAmount = 0.00;
                    }
                    vm.CurrencyData = idata;
                    //return 
                });
        }

        function ConvertMoneyForTransferTo(code, amt) {
            //$localStorage.SelectedCountry.ConvertAmount = 0;

            var accesstoken = 'rxv51rk8b4y1kjhasvww';
            $http({
                url: 'https://currencydatafeed.com/api/converter.php?' + $.param({ token: accesstoken, from: code, to: "USD", amount: amt }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
                .success(function (data) {

                    var idata = data;
                    if (idata.currency[0].value > 0) {
                        var value = parseFloat(idata.currency[0].value).toFixed(2)
                        //var newvalu = value
                        // $localStorage.SelectedCountry.ConvertAmount = value;

                        var DestinationCountryId = "";
                        var SellSpotPrice = value;
                        var data1 = $filter('filter')(vm.Countries, {
                            CurrencyCode: code,
                        }, true);
                        if (data1.length > 0) {
                            DestinationCountryId = data1[0].CountryId;
                        }

                        UpdateglobalExchange(code);
                    }
                    else {
                        $localStorage.SelectedCountry.ConvertAmount = 0.00;
                    }
                    vm.CurrencyData = idata;
                    return value;
                });
        }

        function UpdateglobalExchange(code) {

            //$localStorage.SelectedCountry.ConvertAmount = 0;
            var accesstoken = 'rxv51rk8b4y1kjhasvww';
            $http({
                url: 'https://currencydatafeed.com/api/converter.php?' + $.param({ token: accesstoken, from: "USD", to: code, amount: "1" }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
                .success(function (data) {
                    var idata = data;
                    if (idata.currency[0].value > 0) {
                        var value = parseFloat(idata.currency[0].value).toFixed(2)
                        //var newvalu = value

                        var DestinationCountryId = "";
                        var SellSpotPrice = value;
                        var data1 = $filter('filter')(vm.Countries, {
                            CurrencyCode: code,
                        }, true);
                        if (data1.length > 0) {
                            DestinationCountryId = data1[0].CountryId;
                        }

                        var formData = JSON.parse(JSON.stringify({ "DestinationCountryId": DestinationCountryId, "SellSpotPrice": SellSpotPrice }));
                        $http({
                            method: 'POST',
                            url: baseUrl + 'updateRealfeesglobalExchangerate',
                            data: formData,
                            headers: { 'Content-Type': 'application/json; charset=utf-8' }
                        })
                        .success(function (data) {

                            $localStorage.SelectedCountry.IsGlobalExchangeRate = false;
                            if (data.Result == "Success") {
                                var iconvert = (parseFloat(data.GlobalExchangeRate) - parseFloat(data.SellSpotPrice)).toFixed(2);
                                $localStorage.SelectedCountry.IsGlobalExchangeRate = true;
                                //$localStorage.SelectedCountry.ConvertAmount = iconvert;
                                ConvertMoneyMargin(code, iconvert);
                                $localStorage.SelectedCountry.GlobalExchangesRate = parseFloat(data.GlobalExchangeRate).toFixed(2);
                            } else {
                                $localStorage.SelectedCountry.IsGlobalExchangeRate = false;
                                $localStorage.SelectedCountry.GlobalExchangesRate = parseFloat(data.SellSpotPrice).toFixed(2);
                            }
                        });

                    }

                    //return 
                });
        }

        function ConvertMoneyMargin(code, amount) {
            if (amount.startsWith("-")) {
                var amount = amount.substr(1);
            }
            if (code) {
                var accesstoken = 'rxv51rk8b4y1kjhasvww';
                $http({
                    url: 'https://currencydatafeed.com/api/converter.php?' + $.param({ token: accesstoken, from: code, to: "USD", amount: amount }),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    dataType: "json",
                })
                    .success(function (data) {
                        var idata = data;
                        if (idata.currency[0].value > 0) {
                            var value = parseFloat(idata.currency[0].value).toFixed(2);
                            var convertAmt = $localStorage.SelectedCountry.ConvertAmount;
                            $localStorage.SelectedCountry.ConvertAmount = (parseFloat(convertAmt) + parseFloat(value));

                            //vm.TemporaryGlobalExchangeRate.MarginAmount = value + " " + "USD";
                        }
                        else { //vm.TemporaryGlobalExchangeRate.MarginAmount = '0.00' + " " + "USD";
                        }

                    });
            }
        }
        //===============================End=============================//

        function GetCustomerTransactionDetails(CustomerId, CompanyId) {
            vm.CustomerID = CustomerId;
            var formData = JSON.parse(JSON.stringify({ "CustomerId": CustomerId, "CompanyId": CompanyId }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getCustomerTransaction ',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                if (idata.CustomerId > 0) {
                    $localStorage.GustCustomer.TotalTransactionsAmt = idata.SendingAmount;
                    $localStorage.GustCustomer.TotalTransactionsInWeek = idata.WeekTransactionCount;
                    $localStorage.GustCustomer.CurrentMonthTransactionCount = idata.CurrentMonthTransactionCount;
                    $localStorage.GustCustomer.PreviousMonthTransactionCount = idata.PreviousMonthTransactionCount;
                    $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount = idata.PrevioustoPreviousMonthTransactionCount;

                    GeticantCheckStatus(vm.CustomerID)
                }
                //setTimeout(function () { window.location.reload(); }, 1000);
            });
        }

        function GeticantCheckStatus(CustomerId) {
            var data = { "CustomerId": CustomerId, "CompanyId": "0", "ApplicantId": "" }
            var formData = JSON.parse(JSON.stringify(data));
            $http({
                method: 'POST',
                url: baseUrl + 'getsaveapplicantkyc',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
             .success(function (data) {
                 var idata = data[0];
                 if (idata !== undefined && idata.icantCheckId) {
                     $localStorage.GustCustomer.KYCStatus = idata.Status;
                 }
             });
        }
    }

    manageCustomerLoginController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log'];
    function manageCustomerLoginController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log) {
        var vm = $scope;

        var CompanyId = 0;
        vm.CustomerID = 0;
        vm.IsLogin = false;
        if ($localStorage.GustCustomer) {
            vm.IsLogin = true;
        }

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


        if ($localStorage.GustCustomer) {

            vm.localStorage = $localStorage;
        }
        //Login gustCustomer
        vm.CustomerModel = { "Email": "", "Password": "" };
        vm.customerlogin = function () {
            var formData = JSON.stringify(vm.CustomerModel);
            $http({
                url: baseUrl + 'authenticatecustomer',
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
            .success(function (data, status, headers, config) {

                var iCustomer = data;
                if (iCustomer.CustomerId) {
                    var GustCustomer = [];
                    vm.CustomerID = iCustomer.CustomerId;
                    vm.CompanyId = iCustomer.CompanyId;
                    $localStorage.GustCustomer = iCustomer;
                    vm.IsLogin = true;
                    Alert(1, "! Login successful.. ");
                    GetCustomerTransactionDetails(vm.CustomerID, vm.CompanyId);
                    // setTimeout(function () { window.location.reload(); }, 1000);
                }
                else {
                    Alert(2, "! Invalid Customer or password. ");
                }
            })
            .error(function (data, status, headers, config) {
                Alert(2, "! " + data);
            });
        }


        vm.timer = function () {
            var timeout = 180000;
            var message = "Time Out for login Do you want exceed your time for next 3 mintue or go back?"
            if ($location.path() == "/Login") {
                timeout = 180000;
                message = "Time Out for Register Do you want exceed your time for  next 3 mintue or go back?"
                setTimeout(function () { $("#loginTimeOut").modal('toggle') }, timeout);
            }
            else if ($location.path() == "/userRegister") {
                timeout = 300000;
                message = "Time Out for Register Do you want exceed your time for  next 5 mintue or go back?"
                setTimeout(function () { $("#loginTimeOut").modal('toggle') }, timeout);
            }
        }
        //

        vm.timer();
        // }, 1000);

        vm.exceedTime = function () {
            var timeout = 300000;
            if ($location.path() == "/userRegister") { timeout = 300000; }
            if ($location.path() == "/Login") { timeout = 180000; }

            $('#loginTimeOut').modal('hide');
            setTimeout(function () {
                var time = 180000;
                $("#loginTimeOut").modal('toggle')
                setTimeout(function () {
                    $localStorage.numberDetails = null;
                    $localStorage.Ammount = '';
                    $localStorage.GustData = '';
                    $localStorage.MobileNumber = '';
                    $localStorage.SelectedCountry = '';
                    $state.go('customerPortal');
                }, time);
            }, timeout);
        }

        vm.goBack = function () {
            $localStorage.numberDetails = '';
            $localStorage.Ammount = '';
            $localStorage.GustData = '';
            $localStorage.MobileNumber = '';
            $localStorage.SelectedCountry = '';
            //$localStorage.GustCustomer = '';
            $localStorage.AmountList = '';
            setTimeout(function () {
                $state.go('customerPortal');
                // $window.location.reload();
            }, 500);
        }


        vm.CustomerRegister = { CompanyId: "0", CountryId: "0", FirstName: '', LastName: '', Address1: '', Address2: '', City: '', State: '', ZipCode: '', Phone: '', Email: '', Password: '', DOB: '', ProfileImage: '', ActivationCode: '', };

        vm.register = function () {
            var iData = vm.CustomerRegister;
            iData.CompanyId = "17";
            var formData = JSON.stringify(iData);
            $http({
                url: baseUrl + 'savecustomer',
                method: 'POST',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
            .success(function (data) {
                var idata = data;
                if (idata.CustomerId) {
                    Alert(1, "! Customer registered successfully..");
                    setTimeout(function () {
                        vm.CustomerModel.Email = vm.CustomerRegister.Email;
                        vm.CustomerModel.Password = vm.CustomerRegister.Password;
                        var formData = JSON.stringify(vm.CustomerModel);
                        $http({
                            url: baseUrl + 'authenticatecustomer',
                            method: 'POST',
                            data: formData,
                            headers: { 'Content-Type': 'application/json' },
                            dataType: "json",
                        })
                        .success(function (data, status, headers, config) {
                            var GustCustomer = data;
                            if (GustCustomer.CustomerId) {
                                vm.IsLogin = true;
                                $localStorage.GustCustomer = data;
                                Alert(1, "! Login successful.. ");
                                if ($localStorage.Ammount) {
                                    $window.location.assign('/makePayment');
                                }
                                else {
                                    $window.location.assign('/customerPortal');
                                }
                                //setTimeout(function () { window.location.reload(); }, 1000);
                            }
                            else {
                                Alert(2, "! Invalid Customer or password. ");
                            }
                        })
                        .error(function (data, status, headers, config) {
                            Alert(2, "! " + data);
                        });
                    }, 1000);
                }
                else {
                    Alert(2, "! Invalid Customer details. ");
                }
            })
        }

        vm.ReloadGustCustomer = function () {
            $localStorage.numberDetails = '';
            $localStorage.Ammount = '';
            $localStorage.GustData = '';
            $localStorage.MobileNumber = '';
            $localStorage.SelectedCountry = '';
            $localStorage.AmountList = '';
            $localStorage = [];
            setTimeout(function () {
                //$window.location.reload();
                $state.go('customerPortal');
            }, 1000);

        }


        vm.logoutGustCustomer = function () {
            $localStorage.numberDetails = '';
            $localStorage.GustCustomer = '';
            $localStorage.Ammount = '';
            $localStorage.GustData = '';
            $localStorage.MobileNumber = '';
            $localStorage.SelectedCountry = '';
            $localStorage.GustCustomer = '';
            $localStorage.AmountList = '';
            $localStorage = [];
            setTimeout(function () {
                $window.location.reload();
                //$state.go('customerPortal');
            }, 1000);

        }

        vm.YesKyc = function () {
            $('#KycConfrimation').modal('toggle');
            $('.modal-backdrop').remove();
            setTimeout(function () {
                $state.go('addKyc');
            }, 500);
        }


        function GeticantCheckStatus(CustomerId) {
            var data = { "CustomerId": CustomerId, "CompanyId": "0", "ApplicantId": "" }
            var formData = JSON.parse(JSON.stringify(data));
            $http({
                method: 'POST',
                url: baseUrl + 'getsaveapplicantkyc',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
             .success(function (data) {
                 var idata = data[0];
                 if (idata !== undefined && idata.icantCheckId) {
                     $localStorage.GustCustomer.KYCStatus = idata.Status;
                 }
                 if ($localStorage.Ammount) {
                     if (!$localStorage.GustCustomer.IsDocumentUpload) {
                         vm.TotalPaidAmt = $localStorage.GustCustomer.TotalTransactionsAmt;
                         vm.WeekTransactions = $localStorage.GustCustomer.TotalTransactionsInWeek;
                         vm.CurrentTransactions = $localStorage.GustCustomer.CurrentMonthTransactionCount;
                         vm.PreviousTransactions = $localStorage.GustCustomer.PreviousMonthTransactionCount;
                         vm.PrevioustoPreviousTransactions = $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount;
                         if (isNaN(vm.TotalPaidAmt)) { vm.TotalPaidAmt = 0; }

                         if (vm.CurrentTransactions <= 0 && vm.PreviousTransactions <= 1 && vm.PrevioustoPreviousTransactions <= 1) {
                             $window.location.assign('#/makePayment');
                         }
                         else if (vm.WeekTransactions < 3) {
                             if ((parseFloat(vm.TotalPaidAmt) + parseFloat($localStorage.FareAmmount)) > 100) {
                                 $('#KycConfrimation').modal('toggle');
                             }
                             else { $window.location.assign('#/makePayment'); }
                         }
                         else { $('#KycConfrimation').modal('toggle'); }
                     }
                     else {
                         $window.location.assign('#/makePayment');
                     }
                 }
                 else if (vm.IsLogin) {
                     //    debugger;
                     $window.location.assign('#/');
                 }
                 else {
                     var url = $state.current.url;
                     $window.location.assign('#/' + url);
                 }
             });
        }


        function GetCustomerTransactionDetails(CustomerId, CompanyId) {
            vm.CustomerID = CustomerId;
            var formData = JSON.parse(JSON.stringify({ "CustomerId": CustomerId, "CompanyId": CompanyId }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getCustomerTransaction ',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                if (idata.CustomerId != null && idata.CustomerId > 0) {
                    $localStorage.GustCustomer.TotalTransactionsAmt = idata.SendingAmount;
                    $localStorage.GustCustomer.TotalTransactionsInWeek = idata.WeekTransactionCount;
                    $localStorage.GustCustomer.CurrentMonthTransactionCount = idata.CurrentMonthTransactionCount;
                    $localStorage.GustCustomer.PreviousMonthTransactionCount = idata.PreviousMonthTransactionCount;
                    $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount = idata.PrevioustoPreviousMonthTransactionCount;

                    GeticantCheckStatus(vm.CustomerID)
                }
                else {
                    if ($localStorage.Ammount) {
                        if (!$localStorage.GustCustomer.IsDocumentUpload) {
                            vm.TotalPaidAmt = $localStorage.GustCustomer.TotalTransactionsAmt;
                            vm.WeekTransactions = $localStorage.GustCustomer.TotalTransactionsInWeek;
                            vm.CurrentTransactions = $localStorage.GustCustomer.CurrentMonthTransactionCount;
                            vm.PreviousTransactions = $localStorage.GustCustomer.PreviousMonthTransactionCount;
                            vm.PrevioustoPreviousTransactions = $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount;
                            if (isNaN(vm.TotalPaidAmt)) { vm.TotalPaidAmt = 0; }

                            if (vm.CurrentTransactions <= 0 && vm.PreviousTransactions <= 1 && vm.PrevioustoPreviousTransactions <= 1) {
                                $window.location.assign('#/makePayment');
                            }
                            else if (vm.WeekTransactions < 3) {
                                if ((parseFloat(vm.TotalPaidAmt) + parseFloat($localStorage.FareAmmount)) > 100) {
                                    $('#KycConfrimation').modal('toggle');
                                }
                                else { $window.location.assign('#/makePayment'); }
                            }
                            else { $('#KycConfrimation').modal('toggle'); }
                        }
                        else {
                            $window.location.assign('#/makePayment');
                        }
                    }
                    else if (vm.IsLogin) {
                        $window.location.assign('#/');
                    }
                    else {
                        var url = $state.current.url;
                        $window.location.assign('#/' + url);
                    }
                }
                //setTimeout(function () { window.location.reload(); }, 1000);
            });
        }
    }


    manageMakePaymentController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams'];
    function manageMakePaymentController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams) {
        var vm = $scope;
        vm.CompanyId = 0;
        vm.CustomerId = 0;
        vm.TotalPaidAmt = 0;
        vm.CustomerName = '';
        vm.localStorage = [{ GustData: '', GustCustomer: 0, SelectedCountry: '' }];
        vm.PayDetails = { SenderName: '', FaceAmount: '', InvoiceAmount: '', MobileNumber: '', InvoiceNumber: '' };
        vm.PaybillModel = { CompanyId: 0, CustomerId: 0, SenderName: '', PaymentMethodId: '0', Amount: '0.00', MobileNumber: '' }

        if ($localStorage.GustCustomer) {
            vm.localStorage = $localStorage;
            if (vm.localStorage.GustCustomer.CustomerId) {
                vm.CompanyId = vm.localStorage.GustCustomer.CompanyId;
                vm.CustomerId = vm.localStorage.GustCustomer.CustomerId;
                vm.CustomerName = vm.localStorage.GustCustomer.FirstName;
                vm.PaybillModel.Amount = vm.localStorage.Ammount;
                vm.TotalPaidAmt = vm.localStorage.GustCustomer.TotalTransactionsAmt;
            }
        }
        else {
            $state.go('Login');
        }

        vm.StatusApproved = false;
        if ($localStorage.GustCustomer) {
            vm.TotalPaidAmt = $localStorage.GustCustomer.TotalTransactionsAmt;
            vm.CurrentTransactions = $localStorage.GustCustomer.CurrentMonthTransactionCount;
            vm.PreviousTransactions = $localStorage.GustCustomer.PreviousMonthTransactionCount;
            vm.PrevioustoPreviousTransactions = $localStorage.GustCustomer.PrevioustoPreviousMonthTransactionCount;
            if (isNaN(vm.TotalPaidAmt)) { vm.TotalPaidAmt = 0; }

            if (vm.CurrentTransactions <= 0 && vm.PreviousTransactions <= 1 && vm.PrevioustoPreviousTransactions <= 1) {
                LoadPaymentMethods();

            }
            else {
                if (parseFloat(vm.TotalPaidAmt) + parseFloat($localStorage.FareAmmount) < 100) {
                    LoadPaymentMethods();

                }
                else {
                    vm.KYCStatus = $localStorage.GustCustomer.KYCStatus;
                    if (vm.KYCStatus == "Success") {
                        //Get Method Details
                        LoadPaymentMethods();

                    }
                    else {
                        vm.StatusApproved = true;
                    }
                }
            }
        }

        //==========================Load Payment Method======================//
        function LoadPaymentMethods() {
            vm.StatusApproved = false;
            vm.PaymentMethods = [];
            var formData = JSON.parse(JSON.stringify({ "CompanyId": vm.CompanyId }));
            $http({
                method: 'POST',
                data: formData,
                url: baseUrl + 'getpaymentmethodbycompanyid ',
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            })
            .success(function (data) {
                var idata = data;
                vm.PaymentMethods = idata;
                if (vm.PaymentMethods[0].PaymentMethodId == 0)
                    vm.PaymentMethods.splice(0, 1);
                setTimeout(function () {
                    vm.selectedMethod(vm.PaymentMethods[0].PaymentMethodId);
                }, 500);

            });
        }

        //===============================End================================//

        //==========================Load Gift Cards========================//
        //function LoadGiftCards() {

        vm.GiftCards = [];
        $http({
            method: 'GET',
            url: baseUrl + 'getGiftCard ',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {
            var idata = data;
            vm.GiftCards = idata;
        });
        //}
        //===============================End===============================//

        //==========================Selected Payment Method/Gift Card========================//
        vm.selectedMethod = function (PaymentId) {
            if (PaymentId > 0) {
                var formData = JSON.parse(JSON.stringify({ "PaymentMethodId": PaymentId, "FeesCategoryId": 2 }));
                $http({
                    method: 'POST',
                    data: formData,
                    url: baseUrl + 'getPaymentFeesDetailsByPaymentMethod ',
                    headers: { 'Content-Type': 'ication/json; charset=utf-8' }
                })
                .success(function (data) {
                    var idata = data;
                    if (idata.length) {
                        angular.forEach(idata, function (data, index) {
                            var val = data;
                            if (vm.localStorage.FareAmmount >= data.StartingAmount && vm.localStorage.FareAmmount <= data.EndAmount) {
                                $localStorage.Fees = data.Fees;
                                vm.PaymentFee = data.Fees;
                            }
                            else { $localStorage.Fees = 0.00; }
                        });
                    }
                    else {
                        $localStorage.Fees = 0.00;
                    }
                });

            }
        }

        vm.isGiftCardSelected = false;
        vm.selectedGiftCard = function (GiftCardId) {
            vm.SelectedCard = GiftCardId;
            if (GiftCardId > 0) {
                vm.isGiftCardSelected = true;
            }
            else {
                vm.isGiftCardSelected = false;
            }
        }

        vm.IsGiftCardNumbervalid = false;
        vm.ValidateCard = function (GiftCardNum) {
            if (GiftCardNum != null) {
                if (GiftCardNum.toString().length > 5) {
                    if (vm.SelectedCard == GiftCardNum) {
                        $("#Gift-number-field").removeClass("has-error");
                        $("#Gift-number-field").addClass("has-success");
                        vm.IsGiftCardNumbervalid = true;
                    }
                    else {
                        $("#Gift-number-field").removeClass("has-success");
                        $("#Gift-number-field").addClass("has-error");
                        vm.IsGiftCardNumbervalid = false;
                    }
                }
            }
        }

        //=================================End====================================//


        vm.Paynow = function () {
            $('#Payconfirm').modal('toggle');
        }

        //==========================Validating of Card Details========================//
        function validate(evt) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
            var regex = /[0-9]|\./;
            if (!regex.test(key)) {
                theEvent.returnValue = false;
                if (theEvent.preventDefault) theEvent.preventDefault();
            }
        }

        var cardNumber = $('#CardNumber');
        var cardNumberField = $('#card-number-field');
        var CvvNumberField = $('#field-cvv');
        var CVV = $("#cvv");
        vm.isCardValid = false;
        cardNumber.keyup(function () {
            if ($.payform.validateCardNumber(cardNumber.val()) == false) {
                cardNumberField.addClass('has-error');
                vm.isCardValid = false;
            } else {
                cardNumberField.removeClass('has-error');
                cardNumberField.addClass('has-success');
                vm.isCardValid = $.payform.validateCardNumber(cardNumber.val());
            }

        });

        vm.isCvvValid = false;
        CVV.keyup(function () {
            var cvvlength = CVV.val().length;
            if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
                if (cvvlength < 4) {
                    CvvNumberField.removeClass('has-success');
                    CvvNumberField.addClass('has-error');
                    vm.isCvvValid = false;
                }
                else {
                    CvvNumberField.removeClass('has-error');
                    CvvNumberField.addClass('has-success');
                    vm.isCvvValid = $.payform.validateCardCVC(CVV.val());
                    $("#alertDiv").hide();
                }
            }
            else {
                if (cvvlength == 3) {
                    CvvNumberField.removeClass('has-error');
                    CvvNumberField.addClass('has-success');
                    vm.isCvvValid = $.payform.validateCardCVC(CVV.val());
                    $("#alertDiv").hide();
                }
                else {
                    CvvNumberField.removeClass('has-success');
                    CvvNumberField.addClass('has-error');
                    vm.isCvvValid = false;
                }
            }
        });

        vm.ExpireModel = { ExpireMonth: '0', ExpireYear: '0' }

        vm.CheckYear = function (year) {
            vm.alert = false;
            var sYear = year;
            var CurrentDate = new Date().getFullYear();
            var Currentyear = CurrentDate.toString().replace(/\D/g, '').substr(2);

            if (parseInt(sYear) > parseInt(Currentyear)) {
                vm.alert = false;
            }
            else {
                vm.alert = true;
                setTimeout(function () {
                    $("#PaymentAlertText").text("Your card is expired");
                }, 100);
            }
        }

        //=================================End====================================//


        //==========================Proceed to payment===========================//
        vm.PaybyGiftCard = { "GiftCardid": 0, "CompanyId": 0, "CustomerId": 0, "TransactionDetail": "Gift card", "SendingAmount": "0", "Charges": "0", "Fees": "0", "Tax": "0", "ReceivingAmount": "0", "BeneficiaryId": "0", "PaymentMethodId": "0", "TransferPurpose": "For g.f", "DeliveryType": "Gift Card" }

        vm.PayForTransferTo = { "MobileNumber": "", "CompanyId": 0, "CustomerId": 0, "TransactionDetail": "Test", "Amount": " ", "Charges": "0", "Fees": "0", "Tax": "0", "SendingCurrencyId": "3", "ReceivingCurrencytId": 3, "BeneficiaryId": "0", "PaymentMethodId": 0, "DestinationCountryId": "139", "SourceCountryId": 139, "IsLive": "true", "TransferPurpose": "Test", "ExchangeRate": "0", "Sender": "ishu", "CardNumber": " ", "setExpirationDate": " ", "cvv": " ", "FaceAmount": " " }

        vm.Create = function (e) {
            vm.alert = false;
            $('#Payconfirm').modal('toggle');
            var idata = vm.PaybillModel;
            if (idata.PaymentMethodId == 18) {
                var GiftNumber = $('#GiftNumber').val();
                if (GiftNumber == "") {
                    //setTimeout(function () {
                    AlertKyc(2, 'Please enter a valid Gift card number');
                    //}, 200);
                    return
                }
                else {
                    vm.PaybyGiftCard.SendingAmount = vm.localStorage.FareAmmount + vm.localStorage.Fees;
                    vm.PaybyGiftCard.Fees = vm.localStorage.Fees;
                    vm.PaybyGiftCard.GiftCardid = idata.GiftCardid;
                    vm.PaybyGiftCard.PaymentMethodId = idata.PaymentMethodId;
                    vm.PaybyGiftCard.CompanyId = vm.localStorage.GustCustomer.CompanyId;
                    vm.PaybyGiftCard.CustomerId = vm.localStorage.GustCustomer.CustomerId;
                    var formData = JSON.stringify(vm.PaybyGiftCard);
                    $http({
                        method: 'POST',
                        url: baseUrl + 'payGiftCard',
                        data: formData,
                        headers: { 'Content-Type': 'application/json' },
                        dataType: "json",
                    })
                    .success(function (data) {
                        var idata = data;
                        if (idata.Result == "Suceess") {
                            AlertKyc(1, "Payment has been success");
                            setTimeout(function () {
                                vm.PayDetails.InvoiceNumber = idata.GiftCardid;
                                vm.PayDetails.InvoiceAmount = vm.localStorage.FareAmmount + vm.localStorage.Fees;
                                vm.PayDetails.FaceAmount = vm.localStorage.FareAmmount;
                                vm.PayDetails.Fees = vm.localStorage.Fees;
                                vm.PayDetails.MobileNumber = vm.localStorage.SelectedCountry.MobileNumber;
                                vm.PayDetails.SenderName = vm.localStorage.GustCustomer.FirstName;


                                $localStorage.ThankyouPageData = vm.PayDetails;

                                $state.go('ThankuCus');
                            }, 1000);
                        }
                        else {

                            AlertKyc(2, idata.Error);
                        }

                    })
                    .error(function (data) {
                        AlertKyc(2, idata.Error);
                    });
                }
            }
            else {
                var isCardValid = $.payform.validateCardNumber(cardNumber.val());
                var isCvvValid = $.payform.validateCardCVC(CVV.val());
                var IsValid = false;
                var cvvlength = CVV.val().length;
                if ($.payform.parseCardType(cardNumber.val()) == 'amex') {
                    if (cvvlength < 4) {
                        CvvNumberField.removeClass('has-success');
                        CvvNumberField.addClass('has-error');
                        vm.alert = true;
                        setTimeout(function () {
                            $("#PaymentAlertText").text('Invaild CVV number');
                        }, 100);
                        return
                    }
                    else {
                        IsValid = true; vm.alert = false;
                    }
                }
                else {
                    if (cvvlength != 3) {
                        CvvNumberField.removeClass('has-success');
                        CvvNumberField.addClass('has-error');
                        vm.alert = true;
                        setTimeout(function () {
                            $("#PaymentAlertText").text('Invaild CVV number');
                        }, 100);
                        return
                    }
                    else { IsValid = true; vm.alert = false; }
                }

                if (isCardValid && IsValid) {
                    if (isCvvValid) {
                        var data = vm.localStorage.GustCustomer;
                        var idata = vm.PaybillModel;
                        idata.Amount = vm.localStorage.FareAmmount + vm.localStorage.Fees;
                        idata.MobileNumber = vm.localStorage.SelectedCountry.MobileNumber;
                        idata.CompanyId = vm.localStorage.GustCustomer.CompanyId;
                        idata.CustomerId = vm.localStorage.GustCustomer.CustomerId;
                        idata.SenderName = vm.localStorage.GustCustomer.FirstName;
                        idata.Fees = vm.localStorage.Fees;
                        idata.SKUId = vm.localStorage.SelectedCountry.skuId;
                        var sMonth = parseInt(vm.ExpireModel.ExpireMonth);
                        if (sMonth < 10) {
                            sMonth = '0' + sMonth
                        }
                        var CurrentDate = new Date();
                        var Currentyear = CurrentDate.getYear();
                        var sYear = vm.ExpireModel.ExpireYear;
                        var expiremonth = sMonth + '' + sYear;
                        idata.setExpirationDate = expiremonth;

                        var formData = JSON.stringify(idata);
                        $http({
                            method: 'POST',
                            url: baseUrl + 'billPay',
                            data: formData,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            dataType: "json",
                        })
                        .success(function (data) {

                            var idata = data;
                            if (idata.Result == "Success" && idata.TransactionId > 0) {
                                idata.InvoiceNumber = idata.PaymentGatewayTransactionId;
                                idata.InvoiceAmount = idata.Amount;
                                idata.FaceAmount = idata.Amount;
                                $state.go('ThankuCus');
                            }
                            else {
                                AlertKyc(2, idata.Error);
                            }
                            vm.PayDetails = idata;
                            $localStorage.ThankyouPageData = vm.PayDetails;
                        });
                    }
                    else {
                        vm.alert = true;
                        setTimeout(function () {
                            $("#PaymentAlertText").text('Invaild Card');
                        }, 100);
                    }
                }
                else {
                    vm.alert = true;
                    setTimeout(function () {
                        $("#PaymentAlertText").text('Invaild CVV number ');
                    }, 100);
                }
            }
        }
        //=================================End====================================//
        vm.cancel = function () {
            vm.localStorage.Ammount = '';
            vm.localStorage.FareAmmount = '';
            vm.localStorage.GustData = '';
            vm.localStorage.MobileNumber = '';
            vm.localStorage.SelectedCountry = '';
            $state.go('customerPortal');
        }


    }


    manageGuestCustomerTransactionController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log', '$filter'];
    function manageGuestCustomerTransactionController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log, $filter) {
        var vm = $scope;
        var CompanyId = 0;
        vm.localStorage = 0;
        //GustData

        if ($localStorage.GustCustomer.CustomerId) {
            vm.localStorage = [];
            vm.localStorage = $localStorage;
        } else {
            $state.go('customerPortal')
        }

        //Remove BackDrop
        $('.modal-backdrop').remove();

        //Get Method Details
        vm.ManageTransaction = [];
        var formData = JSON.parse(JSON.stringify({ "CustomerId": vm.localStorage.GustCustomer.CustomerId }));
        $http({
            method: 'POST',
            data: formData,
            url: baseUrl + 'gettranscationdetails',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
        .success(function (data) {

            var idata = data;
            $scope.reverse = true;
            idata = $filter('orderBy')(idata, 'TransactionId', $scope.reverse);

            vm.totalItems = idata.length;
            vm.currentPage = 1;
            vm.itemsPerPage = 15;

            vm.$watch("currentPage", function () {
                setPagingData(vm.currentPage);
            });

            function setPagingData(page) {
                var pagedData = idata.slice(
                  (page - 1) * vm.itemsPerPage,
                  page * vm.itemsPerPage
                );
                vm.ManageTransaction = pagedData;
            }
            //}, 100);
        });

        //Format date
        $scope.formatDate = function (date) {
            var dateOut = new Date(date);
            return dateOut;
        };

        vm.logoutGustCustomer = function () {
            if ($localStorage.GustCustomer) {
                $localStorage.numberDetails = '';
                $localStorage.GustCustomer = '';
                $localStorage.Ammount = '';
                $localStorage.GustData = '';
                $localStorage.MobileNumber = '';
                $localStorage.SelectedCountry = '';
                $localStorage.GustCustomer = '';

                $localStorage = [];
                setTimeout(function () {
                    $window.location.reload();
                    //$state.go('customerPortal');
                }, 1000);
            }
        }



    }


    customerPortalthankyouController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$translate', '$log'];
    function customerPortalthankyouController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $translate, $log) {
        var vm = $scope;
        var CompanyId = 0;
        vm.CustomerId = 0;
        vm.localStorage = "";
        if ($localStorage.GustCustomer) {


            vm.localStorage = $localStorage.ThankyouPageData;
            vm.localStorage.Fees = $localStorage.Fees;
        } else {
            $state.go('Login');
        }








    }

    authenticateGuestController.$inject = ['$scope', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams'];
    function authenticateGuestController($scope, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams) {
        var vm = $scope;

        if ($localStorage.GustCustomer) {
            vm.localStorage = $localStorage.GustCustomer;

            if (!vm.localStorage.CustomerId) {
                $window.location.reload();
            }
            else {
                var url = $state.current.url;
                $window.location.assign('#/' + url);
            }
        }
        else {
            $window.location.assign('#/');
        }
    }

    addEditkycController.$inject = ['$scope', '$q', '$http', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', '$stateParams', '$filter'];
    function addEditkycController($scope, $q, $http, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, $stateParams, $filter) {
        var vm = $scope;
        vm.CustomerId = 0;
        vm.CompanyId = 0;
        vm.CountryId = 0;
        vm.ProfileModal = { AccountNumber: "", ActivationCode: "", Address1: "", Address2: "", BuildingNumber: 0, City: "", CompanyId: 0, CountryId: 0, CustomerId: 0, DOB: "", Email: " ", FileName: "", FileType: "", FirstName: "", Gender: "", LastName: "", Password: "", Phone: "", ProfileImage: "", Side: "Front", State: " ", Street: "", Title: "Mr", Town: "", ZipCode: "" }
        vm.localStorage = [{ GustData: '', GustCustomer: 0, SelectedCountry: '' }];
        if ($localStorage.GustCustomer) {
            vm.localStorage = $localStorage;
            if (vm.localStorage.GustCustomer.CustomerId) {
                vm.CompanyId = vm.localStorage.GustCustomer.CompanyId;
                vm.CustomerId = vm.localStorage.GustCustomer.CustomerId;
            }
        }
        else {
            $state.go('Login');
        }
        //Get Customer Details
        if (vm.CustomerId) {

            var formData = JSON.parse(JSON.stringify({ "CustomerId": vm.CustomerId }));
            $http({
                method: 'POST',
                url: baseUrl + 'getcustomerdetails',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
                dataType: "json",
            })
             .success(function (data) {
                 var idata = data;
                 if (idata) {
                     idata.Phone = parseInt(idata.Phone);
                     idata.CountryId = JSON.stringify(idata.CountryId);
                     vm.ProfileModal = idata;
                     if (vm.ProfileModal.IsDocumentUpload) {
                         $('#submitkycbutton').prop('disabled', false);
                     }
                     if (vm.ProfileModal.Title == null)
                         vm.ProfileModal.Title = "Mr";
                     if (vm.ProfileModal.Gender == null)
                         vm.ProfileModal.Gender = "";
                     if (vm.ProfileModal.FileName == null)
                         vm.ProfileModal.FileName = "passport";
                     if (vm.ProfileModal.Side == null)
                         vm.ProfileModal.Side = "front";
                     vm.ProfileModal.Password = "";
                 }
             });
        }


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


        //------------------Image Uploader-----------------//


        $("#upload").change(function ($event) {

            $('#submitkycbutton').prop('disabled', true);
            var fileReader = new FileReader();
            var file = $event.target.files[0];
            fileReader.readAsDataURL(file);

            setTimeout(function () {
                var filename = file.name;
                var extn = filename.split(".").pop();
                var strToReplace = fileReader.result;
                var strImage = strToReplace.replace(/^data:image\/[a-z]+;base64,/, "");
                vm.FileName = filename.replace("." + extn, "");
                vm.FileExt = extn;
                vm.imageData = strImage;
                if (vm.imageData != "") {
                    if ((extn == "jpg" || extn == "jpeg") || (extn == "png" || extn == "PNG")) {
                        move();
                    }
                }
            }, 2000);
        });


        function move() {
            var elem = document.getElementById("myBar");
            var width = 2;
            var id = setInterval(frame, 100);

            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    $('#submitkycbutton').prop('disabled', false);
                }
                else {
                    width++;
                    elem.style.width = width + '%';
                    elem.innerHTML = width * 1 + '%';
                }
            }
        }
        //------------Image Reader-------------//

        vm.Create = function () {
            //CustomerGenger
            // var file = document.getElementById('upload').files[0];
            if (vm.ProfileModal) {
                var formData = JSON.parse(JSON.stringify(vm.ProfileModal));
                $http({
                    method: 'POST',
                    url: baseUrl + 'savecustomer',
                    data: formData,
                    headers: { 'Content-Type': 'application/json' },
                    dataType: "json",
                })
                .success(function (data) {
                    var idata = data;
                    if (idata && idata.Result == "Sucess") {
                        var DataResult = angular.copy(vm.ProfileModal);
                        var Country = $filter('filter')(vm.Countries, { CountryId: parseInt(vm.ProfileModal.CountryId) }, true
                        );
                        var data = { CustomerId: vm.ProfileModal.CustomerId, CompanyId: vm.ProfileModal.CompanyId, Title: vm.ProfileModal.Title, FirstName: vm.ProfileModal.FirstName, LastName: vm.ProfileModal.LastName, Gender: vm.ProfileModal.Gender, DOB: vm.ProfileModal.DOB, Country: Country[0].CountryName.substr(0, 3).toUpperCase(), FlatNumber: vm.ProfileModal.Address1, BuildingName: vm.ProfileModal.BuildingNumber, BuildingNumber: vm.ProfileModal.Address2, Street: vm.ProfileModal.Street, State: vm.ProfileModal.State, Town: vm.ProfileModal.Town, PostalCode: vm.ProfileModal.ZipCode, Phone: vm.ProfileModal.Phone };
                        var formData = JSON.parse(JSON.stringify(data));
                        $http({
                            method: 'POST',
                            url: baseUrl + 'addicant',
                            data: formData,
                            headers: { 'Content-Type': 'application/json' },
                            dataType: "json",
                        })
                            .success(function (data) {
                                if (data.icantId != "") {
                                    vm.icantId = data.icantId;
                                    if (vm.imageData !== undefined && vm.imageData != "" && vm.icantId != '') {
                                        var formdata = { "icantId": data.icantId, "Type": vm.ProfileModal.FileName, "Side": vm.ProfileModal.Side, "ImageName": vm.FileName, "ImageExt": "." + vm.FileExt, "ImageString": vm.imageData }
                                        $http({
                                            method: 'POST',
                                            url: baseUrl + 'uploadDocumentKYC',
                                            data: formdata,
                                            headers: { 'Content-Type': 'application/json' },
                                            dataType: "json",
                                        })
                                         .success(function (data) {
                                             if (data.Result == "Sucess") {
                                                 ///AlertKyc(1, "Thanks for updating your KYC document");
                                                 if (data.icantId != "") {
                                                     var formdata = { "icantId": vm.icantId }
                                                     $http({
                                                         method: 'POST',
                                                         url: baseUrl + 'createicantCheck',
                                                         data: formdata,
                                                         headers: { 'Content-Type': 'application/json' },
                                                         dataType: "json",
                                                     })
                                                      .success(function (data) {
                                                          if (data.icantCheckId != '') {
                                                              AlertKyc(1, "Thanks for updating your KYC document");
                                                              setTimeout(function () {
                                                                  $state.go('customerPortal');
                                                              }, 500);
                                                              // GeticantCheckStatus(data.icantCheckId);
                                                          }
                                                          else {
                                                              AlertKyc(2, data.Error);

                                                          }
                                                      });
                                                 }
                                             }
                                             else {
                                                 AlertKyc(2, data.Error);
                                             }
                                         });
                                    }
                                    else { AlertKyc(1, "Thanks for updating your KYC details"); }
                                }
                                else { AlertKyc(2, data.Error); }

                            });
                    }
                    else {
                        AlertKyc(2, idata.Error);
                    }
                });
            }
        }

        vm.cancel = function () {
            $state.go('customerPortal');
        }
    }

})();
