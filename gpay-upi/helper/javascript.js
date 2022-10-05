const canMakePaymentCache = 'canMakePaymentCache';



function readSupportedInstruments() {
    let formValue = {};
    formValue['pa'] = document.getElementById('pa').value;
    formValue['pn'] = document.getElementById('pn').value;
    formValue['tn'] = document.getElementById('tn').value;
    formValue['mc'] = document.getElementById('mc').value;
    formValue['tr'] = document.getElementById('tr').value;
    formValue['tid'] = document.getElementById('tid').value;
    formValue['url'] = document.getElementById('url').value;
    return formValue;
}


function readAmount() {
    return document.getElementById('amount').value;
}


function onBuyClicked() {
    if (!window.PaymentRequest) {
        console.log('Web payments are not supported in this browser.');
        return;
    }

    let formValue = readSupportedInstruments();

    const supportedInstruments = [
        {
            supportedMethods: ['https://pwp-server.appspot.com/pay-dev'],
            data: formValue,
        },
        {
            supportedMethods: ['https://tez.google.com/pay'],
            data: formValue,
        },
    ];

    const details = {
        total: {
            label: 'Total',
            amount: {
                currency: 'INR',
                value: readAmount(),
            },
        },
        displayItems: [
            {
                label: 'Original amount',
                amount: {
                    currency: 'INR',
                    value: readAmount(),
                },
            },
        ],
    };

    const options = {
        requestShipping: true,
        requestPayerName: true,
        requestPayerPhone: true,
        requestPayerEmail: true,
        shippingType: 'shipping',
    };

    let request = null;
    try {
        request = new PaymentRequest(supportedInstruments, details, options);
    } catch (e) {
        console.log('Payment Request Error: ' + e.message);
        return;
    }
    if (!request) {
        console.log('Web payments are not supported in this browser.');
        return;
    }

    request.addEventListener('shippingaddresschange', function (evt) {
        evt.updateWith(new Promise(function (resolve) {
            fetch('/ship', {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                body: addressToJsonString(request.shippingAddress),
                credentials: 'include',
            })
                .then(function (options) {
                    if (options.ok) {
                        return options.json();
                    }
                    console.log('Unable to calculate shipping options.');
                })
                .then(function (optionsJson) {
                    if (optionsJson.status === 'success') {
                        updateShipping(details, optionsJson.shippingOptions, resolve);
                    } else {
                        console.log('Unable to calculate shipping options.');
                    }
                })
                .catch(function (err) {
                    console.log('Unable to calculate shipping options. ' + err);
                });
        }));
    });

    request.addEventListener('shippingoptionchange', function (evt) {
        evt.updateWith(new Promise(function (resolve) {
            for (let i in details.shippingOptions) {
                if ({}.hasOwnProperty.call(details.shippingOptions, i)) {
                    details.shippingOptions[i].selected =
                        (details.shippingOptions[i].id === request.shippingOption);
                }
            }

            updateShipping(details, details.shippingOptions, resolve);
        }));
    });

    var canMakePaymentPromise = checkCanMakePayment(request);
    canMakePaymentPromise
        .then((result) => {
            showPaymentUI(request, result);
        })
        .catch((err) => {
            console.log('Error calling checkCanMakePayment: ' + err);
        });
}


function checkCanMakePayment(request) {

    if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
        return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
    }


    var canMakePaymentPromise = Promise.resolve(true);


    if (request.canMakePayment) {
        canMakePaymentPromise = request.canMakePayment();
    }

    return canMakePaymentPromise
        .then((result) => {

            sessionStorage[canMakePaymentCache] = result;
            return result;
        })
        .catch((err) => {
            console.log('Error calling canMakePayment: ' + err);
        });
}


function showPaymentUI(request, canMakePayment) {

    if (!canMakePayment) {
        redirectToPlayStore();
        return;
    }


    let paymentTimeout = window.setTimeout(function () {
        window.clearTimeout(paymentTimeout);
        request.abort()
            .then(function () {
                console.log('Payment timed out after 20 minutes.');
            })
            .catch(function () {
                console.log('Unable to abort, user is in the process of paying.');
            });
    }, 20 * 60 * 1000);

    request.show()
        .then(function (instrument) {
            window.clearTimeout(paymentTimeout);
            processResponse(instrument);
        })
        .catch(function (err) {
            console.log(err);
        });
}


function processResponse(instrument) {
    var instrumentString = instrumentToJsonString(instrument);
    console.log(instrumentString);

    fetch('/buy', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: instrumentString,
        credentials: 'include',
    })
        .then(function (buyResult) {
            if (buyResult.ok) {
                return buyResult.json();
            }
            console.log('Error sending instrument to server.');
        })
        .then(function (buyResultJson) {
            completePayment(
                instrument, buyResultJson.status, buyResultJson.message);
        })
        .catch(function (err) {
            console.log('Unable to process payment. ' + err);
        });
}


function completePayment(instrument, result, msg) {
    instrument.complete(result)
        .then(function () {
            console.log('Payment completes.');
            console.log(msg);
            document.getElementById('inputSection').style.display = 'none'
            document.getElementById('outputSection').style.display = 'block'
            document.getElementById('response').innerHTML =
                JSON.stringify(instrument, undefined, 2);
        })
        .catch(function (err) {
            console.log(err);
        });
}


function redirectToPlayStore() {
    if (confirm('Tez not installed, go to play store and install?')) {
        window.location.href =
            'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user.alpha'
    };
}


function addressToJsonString(address) {
    var addressDictionary = address.toJSON ? address.toJSON() : {
        recipient: address.recipient,
        organization: address.organization,
        addressLine: address.addressLine,
        dependentLocality: address.dependentLocality,
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        sortingCode: address.sortingCode,
        country: address.country,
        phone: address.phone,
    };
    return JSON.stringify(addressDictionary, undefined, 2);
}


function instrumentToJsonString(instrument) {

    var instrumentDictionary = {
        methodName: instrument.methodName,
        details: instrument.details,
        shippingAddress: addressToJsonString(instrument.shippingAddress),
        shippingOption: instrument.shippingOption,
        payerName: instrument.payerName,
        payerPhone: instrument.payerPhone,
        payerEmail: instrument.payerEmail,
    };
    return JSON.stringify(instrumentDictionary, undefined, 2);
}


function updateShipping(details, shippingOptions, callback) {
    let selectedShippingOption;
    for (let i in shippingOptions) {
        if (shippingOptions[i].selected) {
            selectedShippingOption = shippingOptions[i];
        }
    }

    var total = parseFloat(readAmount());
    if (selectedShippingOption) {
        let shippingPrice = Number(selectedShippingOption.amount.value);
        total = total + shippingPrice;
    }

    details.shippingOptions = shippingOptions;
    details.total.amount.value = total.toFixed(2);
    if (selectedShippingOption) {
        details.displayItems.splice(
            1, details.displayItems.length == 1 ? 0 : 1, selectedShippingOption);
    }

    callback(details);
}

export default onBuyClicked;





