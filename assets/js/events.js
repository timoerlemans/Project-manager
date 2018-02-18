'use strict';

var jsondata = [],
    elGridView,
    elListView,
    list,
    body = document.querySelector('body'),
    modal = document.querySelector('.modal'),
    modalContent = document.querySelector('.modal__content'),
    modalCloseBtn = document.querySelector('.js-close-button'),
    urlParams = new URLSearchParams(window.location.search);

// Check if document is ready and runs the _init function
document.addEventListener('DOMContentLoaded', _init, false);

/**
 * The init functions contains all other functions and events, so that they are all available for eachother
 */

function _init() {
    /**
     * @function xhr
     * Opens an XHR request to the backend.
     * The backend runs on my personal website, which is defined in @var xhrUrl
     * The backend code is available on https://github.com/timoerlemans/Project-manager_DB
     * It requires a webserver with PHP.
     *
     * @param {String} action - can be either 'read', 'remove' or 'write'. When left empty, it will default to 'read'
     * @param {any} data - the data that will be send to the backend
     */
    function xhr(action, data) {
        var xhr = new XMLHttpRequest();
        var xhrUrl = 'http://www.timoerlemans.nl/xhr/xhr.php';
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var responseData = JSON.parse(xhr.responseText);
                if (
                    responseData.status === 'fail' ||
                    responseData.status === 'error' ||
                    responseData.message !== undefined
                ) {
                    showModal(true, responseData.message, true);
                    loader();
                } else {
                    var jsondata = responseData.data;
                    if (body.classList.contains('overview-page')) {
                        fillProfileOverview(jsondata);
                    } else if (body.classList.contains('profile-page')) {
                        /**
                         * Using the relatively new urlSearchParams API to determine if the query string id is set (this doesn't work in IE)
                         * @var urlParams = new URLSearchParams(window.location.search);
                         */

                        if (urlParams.has('id')) {
                            fillProfilePage(
                                jsondata,
                                parseInt(urlParams.get('id'))
                            );
                        } else {
                            showModal(
                                true,
                                '<p>Er is geen profielID gevonden, profiel kan niet weergegeven worden. <a href="/">Ga terug naar het overzicht</a>.</p>',
                                true
                            );
                            loader();
                        }
                    } else if (body.classList.contains('create-profile')) {
                        loader();
                    }
                }
            }
        };

        if (!action || action === 'read') {
            xhr.open('GET', xhrUrl + '?type=read', true);
        }
        if (action === 'remove' && !isNaN(parseInt(data))) {
            xhr.open('GET', xhrUrl + '?type=remove&id=' + data, true);
        }
        if (action === 'write') {
            xhr.open('GET', xhrUrl + '?type=write&' + data, true);
        }
        xhr.send(null);
    }

    /**
     * @function fillProfileOverview
     *
     * Is used to populate the profile overview page (index.html)
     *
     * @param {Array} data - an array of objects
     */
    function fillProfileOverview(data) {
        for (var item in data) {
            var li = document.createElement('li');
            li.setAttribute('id', data[item].id);
            li.classList.add('profiles-list__item');
            list.appendChild(li);
            li.innerHTML =
                '<a href="/profile.html?id=' +
                data[item].id +
                '" class="profiles-list__preview"><img class="profiles-list__img" src="' +
                data[item].picture +
                '"><div class="profiles-list__info"><span class="profiles-list__name">' +
                data[item].name +
                '</span><span class="profiles-list__email">' +
                data[item].email +
                '</span></div></a>';
        }
        loader(false);
    }

    /**
     * @function fillProfilePage
     *
     * Is used to populate the profile page (profile.html)
     *
     * @param {Array} data - an array of objects
     * @param {Int} id - The id of the profile
     */
    function fillProfilePage(data, id) {
        for (var item in data) {
            if (data[item].id === id) {
                document
                    .querySelector('.js-profile-img')
                    .setAttribute('src', data[item].picture);
                document.querySelector('.js-profile-name').innerHTML =
                    data[item].name;
                document.querySelector('.js-profile-birthday').innerHTML =
                    data[item].birthday;
                document.querySelector('.js-profile-email').innerHTML =
                    data[item].email;
                document.querySelector('.js-profile-address').innerHTML =
                    data[item].address;
                document.querySelector('.js-profile-bio').innerHTML =
                    data[item].bio;
                loader();
            }
        }
    }

    /**
     * @function loader
     *
     * Used to show or hide the loader icon
     *
     * @param {bool} show - true shows the loader, false hides it
     */
    function loader(show) {
        if (show) {
            document.querySelector('.loader').classList.remove('hidden');
        } else {
            document.querySelector('.loader').classList.add('hidden');
        }
    }

    /**
     * @function showModal
     *
     * Function to show or hide, and populate the modal
     *
     * @param {bool} show - Used to show or hide the modal
     * @param {string} content - Used to populate the content of the modal with (may contain HTML-code)
     * @param {bool} hideclosebtn - If true, hides the modal close button so it can't be closed
     */
    function showModal(show, content, hideclosebtn) {
        if (show) {
            modalContent.innerHTML = content;
            modal.classList.add('open');
        } else {
            modal.classList.remove('open');
            modalContent.innerHTML = '';
        }
        if (!hideclosebtn) {
            modalCloseBtn.classList.remove('hidden');
            modal.classList.remove('hide-all');
        } else {
            modalCloseBtn.classList.add('hidden');
            modal.classList.add('hide-all');
        }
    }

    /**
     * @function modalEvtList
     *
     * Adds event listeners when the modal is populated with buttons
     *
     */
    function modalEvtLst() {
        var confirmBtn = document.querySelector('.js-confirm-remove');
        var cancelBtn = document.querySelector('.js-cancel-remove');
        confirmBtn.addEventListener('click', function(e) {
            xhr('remove', urlParams.get('id'));
            loader(true);
            showModal(false);
        });
        cancelBtn.addEventListener('click', function(e) {
            showModal(false);
        });
    }

    /**
     * @function createProfile
     *
     * Used to send form data to the backend to create a new profile
     * Is fired on submitting the form in create.html
     *
     */
    function createProfile() {
        var submitData =
            'name=' +
            encodeURIComponent(document.querySelector('#name').value) +
            '&birthday=' +
            encodeURIComponent(document.querySelector('#birthday').value) +
            '&email=' +
            encodeURIComponent(document.querySelector('#emailaddress').value) +
            '&address=' +
            encodeURIComponent(document.querySelector('#address').value) +
            '&bio=' +
            encodeURIComponent(document.querySelector('#bio').value) +
            '&picture=' +
            encodeURIComponent(document.querySelector('#picture').value);
        xhr('write', submitData);
    }

    // End of function declarations

    // Events and eventlisteners are defined herafter

    xhr();

    if (body.classList.contains('overview-page')) {
        elGridView = document.querySelector('.js-grid-view');
        elListView = document.querySelector('.js-list-view');
        list = document.querySelector('.profiles__list');

        elGridView.addEventListener('click', function(e) {
            e.preventDefault();
            list.classList.add('profiles__list--grid');
        });
        elListView.addEventListener('click', function(e) {
            e.preventDefault();
            list.classList.remove('profiles__list--grid');
        });
    }
    if (body.classList.contains('profile-page')) {
        var removeBtn = document.querySelector('.js-remove-profile');
        removeBtn.addEventListener('click', function(e) {
            showModal(
                true,
                '<p>Weet je zeker dat je dit profiel wilt verwijderen?</p><button type="button" class="js-confirm-remove">Heel zeker</button><button type="button" class="js-cancel-remove">Niet zo zeker</button>'
            );
            modalEvtLst();
        });
    }

    if (body.classList.contains('create-profile')) {
        var createForm = document.querySelector('.js-create-profile');
        createForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loader(true);
            createProfile();
        });
    }

    modalCloseBtn.addEventListener('click', function(e) {
        showModal();
    });
}
