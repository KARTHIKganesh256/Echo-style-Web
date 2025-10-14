# 📹 Camera Troubleshooting Guide

## Issues Fixed (Latest Update)

✅ **Camera not stopping** - Now properly stops all video tracks and clears canvas
✅ **Video not showing** - Added proper video loading handlers and ready state checks
✅ **Animation continues after stop** - Fixed animation frame cleanup
✅ **Face/interface not visible** - Improved canvas rendering and video element handling

---

## Common Issues & Solutions

### 1. Camera Won't Start

**Symptoms:**
- Clicking "Start Mirror" does nothing
- Error message: "Unable to access camera"
- Permission popup doesn't appear

**Solutions:**

#### Check Browser Permissions
1. Look for the camera icon in your browser's address bar
2. Click it and ensure camera is set to "Allow"
3. If blocked, change to "Allow" and refresh the page

#### Browser-Specific Steps:

**Chrome/Edge:**
1. Click the lock/camera icon in address bar
2. Camera → Allow
3. Refresh the page

**Firefox:**
1. Click the camera icon in address bar
2. Select "Allow" from dropdown
3. Refresh the page

**Safari:**
1. Safari → Settings → Websites → Camera
2. Find your site and set to "Allow"
3. Refresh the page

#### Check System Permissions

**Windows:**
```
Settings → Privacy → Camera
- Ensure "Allow apps to access your camera" is ON
- Ensure your browser is allowed
```

**Mac:**
```
System Preferences → Security & Privacy → Camera
- Check the box next to your browser
```

---

### 2. Camera Won't Stop / Still Active

**Symptoms:**
- Green camera light still on after clicking "Stop Mirror"
- Can't use camera in other apps
- Page shows camera active indicator

**Solutions:**

#### Immediate Fix:
1. Click "Stop Mirror" button again
2. Refresh the page (F5)
3. Check browser console (F12) for errors

#### If Still Not Working:
1. Close the browser tab completely
2. Reopen the page
3. Check Task Manager/Activity Monitor - ensure browser isn't holding camera

#### Prevention:
- The latest update fixes this issue
- Camera now properly releases all tracks
- Console shows "Stopped track: video" when working correctly

---

### 3. Video Not Showing / Black Screen

**Symptoms:**
- Camera starts but shows black canvas
- No error message
- Season filters not visible

**Solutions:**

#### Quick Fixes:
1. **Wait a moment** - Video might take 2-3 seconds to load
2. **Check lighting** - Ensure room is well-lit
3. **Try another browser** - Chrome/Edge work best
4. **Refresh the page** - Sometimes helps reset video stream

#### Advanced Fixes:

**Check Console for Errors:**
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for camera-related errors
4. Screenshot and report if you see errors

**Camera Resolution:**
- Default: 1280x720
- If video doesn't show, try lower resolution device
- Modern webcams recommended

**Browser Cache:**
```bash
1. Clear browser cache
2. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
3. Try incognito/private mode
```

---

### 4. Face Not Showing / Wrong Camera

**Symptoms:**
- Camera shows but it's the wrong camera
- Face not centered or visible
- Rear camera showing instead of front (mobile)

**Solutions:**

#### Select Correct Camera:
Currently the app requests the "user" facing camera (front camera). If you have multiple cameras:

1. **Browser Settings:**
   - Chrome: Settings → Privacy and Security → Site Settings → Camera
   - Select your preferred camera as default

2. **System Settings:**
   - Ensure built-in webcam is enabled
   - Disconnect external cameras if not needed

#### Position Tips:
- Sit directly in front of camera
- Ensure good lighting from front
- Position face in center of frame
- Maintain 1-2 feet distance from camera

---

### 5. Poor Video Quality / Lag

**Symptoms:**
- Video is choppy or laggy
- Low frame rate
- Pixelated image

**Solutions:**

#### Immediate:
1. **Close other tabs** - Free up browser resources
2. **Close other apps** - Especially video conferencing apps
3. **Improve lighting** - Better lighting = better quality
4. **Move closer to camera** - Improves detection

#### Performance:
1. Use modern browser (Chrome 90+, Edge 90+, Firefox 88+)
2. Update graphics drivers
3. Use device with better GPU
4. Close background applications

---

### 6. Seasonal Filters Not Applying

**Symptoms:**
- Video shows but no color filters
- Clicking season buttons doesn't change anything
- Just plain video feed

**Solutions:**

1. **Verify video is actually playing:**
   - You should see yourself moving
   - Check console for errors

2. **Try different seasons:**
   - Click each season button
   - Wait 1-2 seconds for filter to apply

3. **Check browser compatibility:**
   - Canvas API must be supported
   - Use modern browser

---

## Browser Compatibility

### ✅ Fully Supported
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### ⚠️ Limited Support
- Older browsers may have issues
- Internet Explorer NOT supported

### 📱 Mobile Support
- iOS Safari 14+
- Chrome Mobile
- Firefox Mobile
- Samsung Internet

---

## Testing Your Camera

### Before Using AI Studio:

1. **Test in another app:**
   - Open camera app on your device
   - Join a video call (Zoom, Teams, etc.)
   - Verify camera works elsewhere

2. **Check browser compatibility:**
   - Visit: https://www.webrtc.org/getting-started/testing
   - Ensure WebRTC is working

3. **Verify HTTPS:**
   - Camera requires HTTPS (or localhost)
   - Check address bar shows 🔒 or "localhost"

---

## Developer Console Checks

Open Console (F12) and look for:

### ✅ Good Messages:
```
Stopped track: video
(when you stop camera)
```

### ❌ Error Messages:

**"NotAllowedError"**
- Solution: Grant camera permissions

**"NotFoundError"**
- Solution: No camera detected, connect a webcam

**"NotReadableError"**
- Solution: Camera in use by another app, close it

**"OverconstrainedError"**
- Solution: Requested resolution not supported

---

## Still Not Working?

### Try These Steps in Order:

1. ✅ **Restart browser completely**
2. ✅ **Clear cache and cookies**
3. ✅ **Try incognito/private mode**
4. ✅ **Try different browser**
5. ✅ **Restart your computer**
6. ✅ **Update browser to latest version**
7. ✅ **Update webcam drivers**
8. ✅ **Check antivirus isn't blocking camera**

### Verify It's Working:

When everything works correctly, you should see:

1. ✅ Permission popup when clicking "Start Mirror"
2. ✅ Video loads within 2-3 seconds
3. ✅ Your face is clearly visible
4. ✅ Seasonal filters apply when clicking buttons
5. ✅ Camera light turns off when clicking "Stop Mirror"
6. ✅ Console shows "Stopped track: video"

---

## Feature-Specific Tips

### AI Mirror Mode:
- Best with good front lighting
- Try all 4 seasons to see different effects
- Glow effects work best in darker rooms

### AR Palette Glow:
- Optimized for mobile devices
- Works best in moderate lighting
- Try different glows for different moods

---

## Reporting Issues

If camera still doesn't work after trying everything:

1. **Open Developer Console (F12)**
2. **Click "Start Mirror"**
3. **Screenshot any error messages**
4. **Note your:**
   - Browser name and version
   - Operating system
   - Webcam model (if known)
5. **Report on GitHub with screenshots**

---

## Technical Details (for developers)

### Camera Stream Configuration:
```javascript
{
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: false
}
```

### Cleanup Process:
1. Cancel animation frames
2. Stop all media tracks
3. Clear video srcObject
4. Clear canvas
5. Reset state

### Video Ready States:
- HAVE_NOTHING (0) - No data
- HAVE_METADATA (1) - Duration known
- HAVE_CURRENT_DATA (2) - Current frame
- HAVE_FUTURE_DATA (3) - Enough to play
- **HAVE_ENOUGH_DATA (4)** - We render at this state

---

## Performance Tips

### For Best Experience:

**Lighting:**
- Natural light from front
- Avoid backlight
- Even lighting on face

**Device:**
- Modern laptop/desktop
- Good webcam (720p+)
- Updated drivers

**Browser:**
- Latest version
- Hardware acceleration enabled
- Minimal extensions

**Environment:**
- Close other camera apps
- Close resource-heavy apps
- Good internet (if cloud features added)

---

## Privacy & Security

✅ **Your privacy is protected:**
- All processing done in browser
- No video sent to servers
- Camera only active when you start it
- Stops completely when you click stop
- No recording or storage of video

---

<div align="center">

**Camera issues resolved?** 🎥

Enjoy your AI Style Studio experience! ✨

</div>

