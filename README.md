# fcptrim
Trim video files as specified in a Final Cut Pro XML file

## Usage

### Install dependencies
Install **[NodeJS](http://nodejs.org)**. Install **ffmpeg**:

```
brew install ffmpeg
```

### Install
```
npm install -g fcptrim
```

### Create "Final Cut Pro XML" representing any number of trimmed videos in a sequence
I used Adobe Premiere. Presumably other programs might work as well, like FCP? The trimmed clips must all be the same length and must all start at time 0.
![](https://cdn-images-1.medium.com/max/1000/1*lBREykmkCRjbMOfxLsUEAA.png)

### Trim
Output will be written to `trimmed/` in the current directory.

```
fcptrim sequence.xml | bash
```