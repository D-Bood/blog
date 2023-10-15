/**
 *  MetingJS for D-Bood's Blog
 *  Only use in hexo-theme-anzhiyu
 *  Thanks: metowolf, 安知鱼
 *  Modified by D-Bood
 *  Released under the MIT license
 *  I am appreciated if you could optimize the code and tell me that.
 **/
class MetingJSElement extends HTMLElement {

  connectedCallback() {
    if (window.APlayer && window.fetch) {
      this._init()
      if (this.meta.choice == 'music') {
        this._parseMusic()
      }
      if (this.meta.choice == 'radio') {
        this._parseRadio()
      }
      this._listenButton()
    }
  }

  disconnectedCallback() {
    if (!this.lock) {
      this.aplayer.destroy()
    }
  }

  _camelize(str) {
    return str
      .replace(/^[_.\- ]+/, '')
      .toLowerCase()
      .replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase())
  }

  _init() {
    let config = {}
    for (let i = 0; i < this.attributes.length; i += 1) {
      config[this._camelize(this.attributes[i].name)] = this.attributes[i].value
    }
    let keys = [
      'server', 'type', 'id', 'api', 'auth', 'choice',
      'auto', 'lock',
      'name', 'title', 'artist', 'author', 'url', 'cover', 'pic', 'lyric', 'lrc',
    ]
    this.meta = {}
    for (let key of keys) {
      this.meta[key] = config[key]
      delete config[key]
    }
    this.config = config

    this.api = this.meta.api || window.meting_api || 'https://mtg.d-bood.top/?server=:server&type=:type&id=:id&r=:r'
    this.pllstapi = 'https://neclmu.d-bood.top/dj/:type?rid=:id&r=:r'
    this.skipLoadPlayer = false
    if (this.meta.auto) this._parse_link()
  }

  _parse_link() {
    let rules = [
      ['music.163.com.*song.*id=(\\d+)', 'netease', 'song'],
      ['music.163.com.*album.*id=(\\d+)', 'netease', 'album'],
      ['music.163.com.*artist.*id=(\\d+)', 'netease', 'artist'],
      ['music.163.com.*playlist.*id=(\\d+)', 'netease', 'playlist'],
      ['music.163.com.*discover/toplist.*id=(\\d+)', 'netease', 'playlist'],
      ['y.qq.com.*song/(\\w+).html', 'tencent', 'song'],
      ['y.qq.com.*album/(\\w+).html', 'tencent', 'album'],
      ['y.qq.com.*singer/(\\w+).html', 'tencent', 'artist'],
      ['y.qq.com.*playsquare/(\\w+).html', 'tencent', 'playlist'],
      ['y.qq.com.*playlist/(\\w+).html', 'tencent', 'playlist'],
      ['xiami.com.*song/(\\w+)', 'xiami', 'song'],
      ['xiami.com.*album/(\\w+)', 'xiami', 'album'],
      ['xiami.com.*artist/(\\w+)', 'xiami', 'artist'],
      ['xiami.com.*collect/(\\w+)', 'xiami', 'playlist'],
    ]

    for (let rule of rules) {
      let patt = new RegExp(rule[0])
      let res = patt.exec(this.meta.auto)
      if (res !== null) {
        this.meta.server = rule[1]
        this.meta.type = rule[2]
        this.meta.id = res[1]
        return
      }
    }
  }

  _parseMusic() {
    if (this.meta.url) {
      let result = {
        name: this.meta.name || this.meta.title || 'Audio name',
        artist: this.meta.artist || this.meta.author || 'Audio artist',
        url: this.meta.url,
        cover: this.meta.cover || this.meta.pic,
        lrc: this.meta.lrc || this.meta.lyric || '',
        type: this.meta.type || 'auto',
      }
      if (!result.lrc) {
        this.meta.lrcType = 0
      }
      if (this.innerText) {
        result.lrc = this.innerText
        this.meta.lrcType = 2
      }
      this._loadPlayer([result])
      return
    }

    let url = this.api
      .replace(':server', this.meta.server)
      .replace(':type', this.meta.type)
      .replace(':id', this.meta.id)
      .replace(':auth', this.meta.auth)
      .replace(':r', Math.random())

    fetch(url)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        if (this.skipLoadPlayer) {
          console.log(result)
          const anMusicPage = document.getElementById("anMusic-page")
          const metingAplayer = anMusicPage.querySelector("meting-js").aplayer
          metingAplayer.list.clear()
          metingAplayer.list.add(result)
        } else {
          this._loadPlayer(result)
        }
      })
  }

  async _fetchRadioPlaylist() {
    let pllsturl = this.pllstapi
      .replace(':type', this.meta.type)
      .replace(':id', this.meta.id)
      .replace(':r', Math.random())
    const pllstres = await fetch(pllsturl)
    const pllstdata = pllstres.json()
    return pllstdata
    }

  _parseRadio() {
    this._fetchRadioPlaylist().then(pllstdata => {
      const djplaylist = []
      for (var i = 0; i <= pllstdata.programs.length - 1; i++) {
        const count = {
          author: "",
          lrc: "",
          pic: "",
          title: "",
          url: ""
        }
        count['author'] = pllstdata.programs[i].dj.nickname
        count['lrc'] = '[00:00.00]\u200B' + pllstdata.programs[i].description
        count['pic'] = pllstdata.programs[i].coverUrl
        count['title'] = pllstdata.programs[i].name
        this.rid = pllstdata.programs[i].mainTrackId
        let songurl = 'https://neclmu.d-bood.top/song/url?id=:rid&r=:r'
          .replace(':rid', this.rid)
          .replace(':r', Math.random())
        fetch(songurl)
          .then(data1 => data1.json())
          .then(res1 => {
            count['url'] = res1.data[0].url.replace(/http/, 'https')
          })
        djplaylist.push(count)
      }
        if (this.skipLoadPlayer) {
          const anMusicPage = document.getElementById("anMusic-page")
          const metingAplayer = anMusicPage.querySelector("meting-js").aplayer
          metingAplayer.list.clear()
          metingAplayer.list.add(djplaylist)
        } else {
          this._loadPlayer(djplaylist)
        }
    })
  }

  _loadPlayer(data) {

    let defaultOption = {
      audio: data,
      mutex: true,
      lrcType: '',
      storageName: ''
    }
    if (this.meta.choice == 'music') {
      defaultOption['lrcType'] = 3
      defaultOption['storageName'] = 'metingjs'
    }
    if (this.meta.choice == 'radio') {
      defaultOption['lrcType'] = 1
      defaultOption['storageName'] = 'metingradiojs'
    }
    
    if (!data.length) return

    let options = {
      ...defaultOption,
      ...this.config,
    }
    for (let optkey in options) {
      if (options[optkey] === 'true' || options[optkey] === 'false') {
        options[optkey] = (options[optkey] === 'true')
      }
    }

    let div = document.createElement('div')
    options.container = div
    this.appendChild(div)

    this.aplayer = new APlayer(options)
  }
  
  _listenButton() {
    if (window.location.pathname == '/music/' || window.location.pathname == '/radio/') {
      const anMusicPage = document.getElementById("anMusic-page")
      const anMusicBtnGetSong = anMusicPage.querySelector("#anMusicBtnGetSong")
      const anMusicRefreshBtn = anMusicPage.querySelector("#anMusicRefreshBtn")
      const anMusicSwitchingBtn = anMusicPage.querySelector("#anMusicSwitching")
      anMusicBtnGetSong.onclick = () => {this._randomPlay(anMusicPage)}
      anMusicRefreshBtn.onclick = () => {this._refreshPlaylist(anMusicPage)}
      anMusicSwitchingBtn.onclick = () => {
        if (window.location.pathname == '/music/') {this._changeMusicList('/json/music.json', 'musicDataList')}
        if (window.location.pathname == '/radio/') {this._changeMusicList('/json/radio.json', 'radioDataList')}
      }
    }
  }
  async _changeMusicList(url, dataname) {
    const anMusicPage = document.getElementById("anMusic-page")
    const metingAplayer = anMusicPage.querySelector("meting-js").aplayer
    const currentTime = new Date().getTime()
    const cacheData = JSON.parse(localStorage.getItem(dataname)) || {timestamp: 0}
    this.skipLoadPlayer = true
    anzhiyu.snackbarShow("播放列表正在切换中，请稍候")
    let lists = []
    let songs = []
    if (currentTime - cacheData.timestamp < 24 * 60 * 60 * 1000) {
      lists = cacheData.lists
      songs = cacheData.songs
    } else {
      const response = await fetch(url)
      const result = await response.json()
      const cacheData = {
        timestamp: new Date().getTime(),
        lists: result.lists,
        songs: result.songs
      }
      localStorage.setItem(dataname, JSON.stringify(cacheData))
      lists = cacheData.lists
      songs = cacheData.songs
    }
    if (window.location.pathname == '/music/') {
      if (songs.length > 0 && changeMusicListFlag) {
        this.meta.type = 'custom'
        metingAplayer.list.clear()
        metingAplayer.list.add(songs)
        changeMusicListFlag = false
        anzhiyu.snackbarShow("该列表为博主自定义播放列表")
      } else {
        this.meta.type = lists[changeMusicCounter].type
        this.meta.id = lists[changeMusicCounter].id
        this.meta.server = lists[changeMusicCounter].server
        changeMusicCounter = changeMusicCounter + 1
        if (changeMusicCounter >= lists.length) {
          changeMusicCounter = 0
          changeMusicListFlag = true
        }
        this._parseMusic()
      }
    } else if (window.location.pathname == '/radio/') {
      this.meta.type = lists[changeRadioCounter].type
      this.meta.id = lists[changeRadioCounter].id
      changeRadioCounter = changeRadioCounter + 1
      if (changeRadioCounter >= lists.length) {changeRadioCounter = 0}
      this._parseRadio()
    }
  }
  _randomPlay(anMusicPage) {
    const metingAplayer = anMusicPage.querySelector("meting-js").aplayer
    const allAudios = metingAplayer.list.audios
    const randomIndex = Math.floor(Math.random() * allAudios.length)
    // 随机播放一首
    metingAplayer.list.switch(randomIndex)
  }
  _refreshPlaylist(anMusicPage) {
    this.skipLoadPlayer = true
    if (this.meta.type == 'custom') {anzhiyu.snackbarShow("非常抱歉，自定义播放列表暂不支持刷新操作")}
    else {
      anzhiyu.snackbarShow("播放列表正在刷新中，请稍候")
      if (window.location.pathname == '/music/') {this._parseMusic()}
      if (window.location.pathname == '/radio/') {this._parseRadio()}
    }
  }
}

console.log('\n %c MetingJS v2.0.1 %c https://github.com/metowolf/MetingJS \n', 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;')

if (window.customElements && !window.customElements.get('meting-js')) {
  window.MetingJSElement = MetingJSElement
  window.customElements.define('meting-js', MetingJSElement)
}