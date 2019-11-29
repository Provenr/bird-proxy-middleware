/**
 * @file 接口统一转发配置 - common
 * @author wujun07
 */
module.exports = [
    {test: '/api/svgs', mock: 'common/svg.js'},
    // {test: '/permissions', mock: 'common/permissions.js'},
    {test: '/failure', mock: 'common/failure'},
    {test: '/entry'},
    {test: '/apply'},
    // {test: '/candidate/queryCandidatePageConfig', mock: 'common/queryCandidatePageConfig'},
    {test: '/tans'},
    {test: 'permissions'},
    {test: 'switchRole'},
    {test: '/handle'},
    {test:'/candidate/indexMessage', mock: 'common/indexMessage'},
    {test: '/campus/offer/refuse/reason', mock: 'common/refuse-reason'}
]