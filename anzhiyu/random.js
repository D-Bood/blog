var posts=["2013/08/01/2013-08-01/","2013/08/10/2013-08-10/","2013/08/17/2013-08-17/","2013/09/19/2013-09-19/","2013/10/01/2013-10-01/","2013/11/16/2013-11-16/","2013/11/30/2013-11-30/","2013/12/15/2013-12-31/","2013/08/21/2013-08-21/","2014/01/01/2014-01-01/","2014/01/24/2014-01-24/","2014/01/27/2014-01-27/","2014/02/01/2014-02-01/","2014/04/06/2014-04-06/","2014/04/18/2014-04-18/","2014/06/09/2014-06-09/","2014/06/10/2014-06-10/","2014/06/12/2014-06-12/","2014/06/13/2014-06-13/","2014/06/19/2014-06-19/","2014/07/08/2014-07-08/","2014/07/19/2014-07-19/","2014/07/28/2014-07-28/","2014/08/10/2014-08-10/","2014/09/10/2014-09-10/","2014/11/06/2014-11-06/","2014/08/26/2014-08-26/","2015/03/01/2015-03-01/","2015/04/18/2015-04-18/","2014/09/19/2014-09-19/","2015/05/16/2015-05-16/","2015/06/22/2015-06-22/","2015/07/26/2015-07-26/","2015/09/22/2015-09-12/","2015/12/29/2015-12-29/","2016/03/05/2016-03-05/","2016/03/22/2016-03-22/","2016/05/15/2016-05-15/","2016/05/19/2016-05-19/","2016/10/17/2016-10-17/","2016/10/21/2016-10-21/","2016/10/31/2016-10-31/","2016/11/20/2016-11-20/","2016/12/19/2016-12-19/","2017/01/01/2017-01-01/","2017/06/30/2017-06-30/","2017/10/19/2017-10-19/","2018/01/17/2018-01-17/","2016/11/24/2016-11-23/","2018/02/23/2018-02-23/","2017/11/10/2017-11-10/","2020/01/16/2020-01-16/","2020/02/14/2020-02-14/","2020/02/29/2020-02-29/","2020/03/20/2020-03-20/","2017/08/27/2017-08-27/","2020/05/11/2020-05-11/","2020/09/22/2020-09-22/","2021/02/22/2021-02-22/","2021/05/04/2021-05-04/","2021/05/23/2021-05-23/","2021/09/20/2021-09-20/","2021/10/26/2021-10-26/","2021/12/10/2021-12-10/","2022/01/09/2022-01-09/","2022/06/25/2022-06-25/","2022/09/20/2022-09-20/","2022/11/12/2022-11-12/","2022/11/06/2022-11-06/","2023/09/23/2023-09-23/","2017/07/12/reCAPTCHA-v2-for-Typecho-评论插件/","2016/08/27/备忘/","2013/11/30/最近的照片/","2014/12/20/有点想说的话/","2017/11/24/未命名文档/","2014/03/01/距離終点百天之総結/"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};