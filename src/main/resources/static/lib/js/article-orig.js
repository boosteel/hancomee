define(["require", "exports", "../editor", "../components/pager"], function (require, exports, editor_1, pager_1) {
    "use strict";
    function default_1() {
        $('a.accordion_title').trigger('click');
        var _a = /.*?([^\/]+)\/?$/.exec(location.pathname), path = _a[1];
        // AngularJS
        angular.module('article', [])
            .controller('articleCtrl', function ($scope, $http) {
            var currentPage = 1, selectTree = $('.select-tree'), 
            // CKEDITOR INIT!
            editor = $scope.editor = editor_1.default({
                // 게시물 저장
                submit: function (article) {
                    article.header.path = path;
                    $http.post('/servlet/ajax/article', article).then(function () {
                        editor.disable();
                        $getList(); // 게시물 저장은 refresh없이 getList만 한다.
                    });
                },
                cancle: function () {
                }
            });
            function $refresh() {
                $getIntro().then(function () {
                    $getList();
                });
            }
            ;
            function $getIntro() {
                return $http.get('/servlet/ajax/article/headers/intro/' + path).then(function (response) {
                    $scope.introList = response.data[path];
                });
            }
            function $getList(page) {
                if (page === void 0) { page = currentPage; }
                return $http.get('/servlet/ajax/article/headers/' + path + '?intro=false&page=' + page).then(function (response) {
                    var _a = response.data, content = _a.content, totalPages = _a.totalPages, number = _a.number, totalElements = _a.totalElements;
                    currentPage = number + 1;
                    $scope.navBtns = pager_1.default(currentPage, totalPages, 10);
                    $scope.name = path;
                    $scope.articles = content;
                    $scope.pageInfo = totalElements ? currentPage + ' / ' + totalPages + ' (' + totalElements + ')' : '';
                });
            }
            $scope.move = $getList;
            $scope.delete = function (id) {
                if (!confirm('삭제하시겠습니까?'))
                    return;
                $http.delete('/servlet/ajax/article/header/' + id).then(function (response) {
                    editor.disable();
                    $refresh();
                });
            };
            $scope.setIntro = function (header) {
                console.log(header);
                if (!header.intro && $scope.introList.length === 2)
                    return alert('대표 게시물은 2개만 설정할 수 있습니다 :)');
                $http.post('/servlet/ajax/article/headers/intro/' + header.id, null).then(function () { return $refresh(); });
            };
            $scope.read = function (id) {
                $http.get('/servlet/ajax/article/read/' + id).then(function (response) {
                    editor.setData(response.data.article);
                });
            };
            $refresh();
        });
        angular.bootstrap($('main').attr('ng-controller', 'articleCtrl as ctrl'), ['article']);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
    ;
});
