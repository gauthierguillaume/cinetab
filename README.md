# 🎬 CineTab

Transform your new tab into a cinematic experience with random movies and TV shows, featuring posters, fanarts, and IMDb ratings.

## ✨ Features

- **Random Content Display**: Shows a random movie or TV show each time you open a new tab
- **Beautiful Visuals**: High-quality posters and fanart backgrounds
- **IMDb Integration**: Real-time ratings and vote counts
- **Customizable Content**: Choose from 40+ categories including:
  - Popular movies and TV shows
  - Top-rated content
  - Trending content
  - Genre-specific filters (Action, Comedy, Drama, Horror, etc.)
  - Regional content (US, UK, French, Korean, Japanese)
- **Responsive Design**: Optimized for all screen sizes including ultrawide displays
- **Interactive Elements**: Click backgrounds to cycle through fanart images

## 🛠️ Installation

### Prerequisites
- Google Chrome browser
- TMDB API key (free)
- OMDb API key (free)

### Setup Instructions

1. **Download the extension**
   ```bash
   git clone https://github.com/yourusername/cinetab.git
   ```

2. **Get your API keys**
   - [TMDB API Key](https://www.themoviedb.org/settings/api) - Free registration required
   - [OMDb API Key](http://www.omdbapi.com/apikey.aspx) - Free tier available

3. **Install the extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked" and select the CineTab folder
   - The extension will appear in your toolbar

4. **Configure your settings**
   - Click the CineTab icon in your toolbar
   - Enter your TMDB and OMDb API keys
   - Select your preferred content categories
   - Click "Save Settings"

## 🎨 Screenshots

*Add screenshots of your extension in action*

## 🔧 Technical Details

- **Manifest Version**: 3
- **APIs Used**: 
  - The Movie Database (TMDB)
  - Open Movie Database (OMDb)
- **Storage**: Chrome Extension Storage API
- **Permissions**: Storage, Host permissions for API calls

## 📁 Project Structure

```
cinetab/
├── manifest.json       # Extension configuration
├── newtab.html         # Main new tab page
├── newtab.js           # Core functionality
├── popup.html          # Settings interface
├── popup.js            # Settings logic
├── style.css           # Styling
└── README.md           # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie and TV show data
- [OMDb API](http://www.omdbapi.com/) for IMDb ratings
- Icons and inspiration from the cinema community

## 🐛 Issues & Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/cinetab/issues) on GitHub.

---

**Enjoy your cinematic browsing experience!** 🍿
