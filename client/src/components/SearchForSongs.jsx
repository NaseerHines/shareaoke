import React from 'react';
import axios from 'axios';
import SpotifyResults from './SpotifyResults.jsx';

class SearchForSongs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      song: '',
      songData: [],
      searchDisplay: false,
      token: '',
      playlists: [],
      songId: 0,
    };
    this.handleSongNameChange = this.handleSongNameChange.bind(this);
    this.searchSpotifyForSong = this.searchSpotifyForSong.bind(this);
    this.addSongToDatabase = this.addSongToDatabase.bind(this);
    // this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.location.state;

    // axios.get(`/api/user/${username}`)
    //   .then((data) => axios.get(`/api/playlist/${data.data[0].id}`)
    //     .then(playlists => this.setState({ playlists: playlists.data, })))
    //   .catch(err => console.error(err));
  }

  handleSongNameChange(e) {
    this.setState({
      song: e.target.value,
    });
  }

  searchSpotifyForSong() {
    const { song, searchDisplay } = this.state;
    const songQuery = encodeURIComponent(song);

    axios.get('/spotify/token')
      .then((data) => {
        this.setState({
          token: data.data.access_token,
        });
      })
      .then(
        () => {
          const { token } = this.state;
          fetch(`https://api.spotify.com/v1/search?q=${songQuery}&type=track&market=US&limit=10`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then(data => this.setState({
              songData: data.tracks.items,
              searchDisplay: !searchDisplay,
            }));
        },
      );
  }

  addSongToDatabase(song) {
    const title = song.song.name;
    const album = song.song.album.name;
    const artist = song.song.album.artists[0].name;
    const imageURL = song.song.album.images[0].url;
    const uri = song.song.uri;

    // console.log(imageURL);
    
    // return axios
    //   .post('/api/song', { title, album, artist, imageURL, uri })
    //   .then(response => {
    //     console.log('added song to database', response);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    // return axios
    //   .post('/api/song', { title, album, artist, image, uri })
    //   .then(axios.get(`/api/song/${title}`).then(data => this.setState({ songId: data.data[0].id })))
  }

  // addSongToPlaylist() {

  // }

  render() {
    const { song, songData, searchDisplay, playlists } = this.state;
    return (
      <div>
        <div>
          Search for a song to add: <input value={song} onChange={this.handleSongNameChange} />
          <button onClick={this.searchSpotifyForSong} type="button">Search</button>
        </div>
        <div>
          {searchDisplay ? <SpotifyResults playlists={playlists} songData={songData} addSong={this.addSongToDatabase} /> : null}
        </div>
      </div>
    );
  }
}

export default SearchForSongs;
