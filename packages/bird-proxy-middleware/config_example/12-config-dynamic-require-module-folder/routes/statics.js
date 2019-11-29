module.exports = [
    {test: '/static/hello$', static: '/test.js'},
    {test: '/static/', static: '/'},

    {test: '/static2/([^/]*)/', static: '/'},

    {test: '/mock/hi2', mock: '/hi2'},
    {test: '/mock/hi', mock: '/hi'},
] 