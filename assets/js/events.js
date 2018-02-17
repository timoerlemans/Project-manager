'use strict';

var jsondata = [],
    elGridView,
    elListView,
    list,
    body = document.querySelector('body'),
    modal = document.querySelector('.modal'),
    modalContent = document.querySelector('.modal-content'),
    modalCloseBtn = document.querySelector('.js-close-button'),
    urlParams = new URLSearchParams(window.location.search);

// Check if document is ready
document.addEventListener('DOMContentLoaded', _init, false);

function _init() {
    // define functions
    function xhr(action, data) {
        var xhr = new XMLHttpRequest();
        var xhrUrl = 'http://www.timoerlemans.nl/xhr/xhr.php';
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var responseData = JSON.parse(xhr.responseText);
                if (responseData.status === 'fail' || responseData.status === 'error') {
                    showModal(true, responseData.message, true);
                }
                var jsondata = responseData.data;
                if (body.classList.contains('overview-page')) {
                    fillProfileOverview(jsondata);
                } else if (body.classList.contains('profile-page')) {
                    // Using the relatively new urlSearchParams API to determine if the query string id is set (this doesn't work in IE)
                    if (urlParams.has('id')) {
                        fillProfilePage(
                            jsondata,
                            parseInt(urlParams.get('id'))
                        );
                    } else {
                        showModal(true, '<p>Er is geen profielID gevonden, profiel kan niet weergegeven worden. <a href="/">Ga terug naar het overzicht</a>.</p>', true);
                        loader();
                    }
                } else if (body.classList.contains('create-profile')) {
                    loader();
                }
            }
        };
        if (!action || action === 'read') {
            xhr.open('GET', xhrUrl + '?type=read', true);
        }
        if (action === 'remove' && !isNaN(parseInt(data))) {
            xhr.open('GET', xhrUrl + '?type=remove&id=' + data, true);
        }
        xhr.send(null);
    }

    function fillProfileOverview(data) {
        for (var item in data) {
            var li = document.createElement('li');
            li.setAttribute('id', data[item].id);
            li.classList.add('profiles-list__item');
            var a = document.createElement('a');
            a.classList.add('profiles-list__preview');
            a.setAttribute('href', '/profile.html?id=' + data[item].id);
            var span = document.createElement('span');
            span.classList.add('profiles-list__name');
            span.textContent = data[item].name;
            var btn = document.createElement('button');
            btn.classList.add('btn--remove');
            btn.textContent = 'x';
            list.appendChild(li);
            li.appendChild(a);
            a.appendChild(span);
            a.appendChild(btn);
        }
        loader(false);
    }

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

    function loader(show) {
        if (show) {
            document.querySelector('.loader').classList.remove('hidden');
        } else {
            document.querySelector('.loader').classList.add('hidden');
        }
    }

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

    function modalEvtLst() {
        var confirmBtn = document.querySelector('.js-confirm-remove');
        var cancelBtn = document.querySelector('.js-cancel-remove');
        confirmBtn.addEventListener('click', function (e) {
            xhr('remove', urlParams.get('id'));
            loader(true);
            showModal(false);
        });
        cancelBtn.addEventListener('click', function (e) {
            showModal(false);
        });
    }

    function createProfile(data) {
        //
    }

    // define events

    xhr();

    if (body.classList.contains('overview-page')) {
        elGridView = document.querySelector('.js-grid-view');
        elListView = document.querySelector('.js-list-view');
        list = document.querySelector('.profiles__list');

        elGridView.addEventListener('click', function (e) {
            e.preventDefault();
            list.classList.add('profiles__list--grid');
        });
        elListView.addEventListener('click', function (e) {
            e.preventDefault();
            list.classList.remove('profiles__list--grid');
        });
    }
    if (body.classList.contains('profile-page')) {
        var removeBtn = document.querySelector('.js-remove-profile');
        removeBtn.addEventListener('click', function (e) {
            showModal(true, '<p>Weet je zeker dat je dit profiel wilt verwijderen?</p><button type="button" class="js-confirm-remove">Heel zeker</button><button type="button" class="js-cancel-remove">Niet zo zeker</button>');
            modalEvtLst();
        });
    }

    modalCloseBtn.addEventListener('click', function (e) {
        modalShow(false);
    });
}
