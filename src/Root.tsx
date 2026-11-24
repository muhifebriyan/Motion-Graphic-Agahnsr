import React from 'react';
import { Composition } from 'remotion';
import { AgahVideoComposition } from './compositions/AgahVideoComposition';
import persibVsBaliData from './data/persib-vs-bali.cuesheet.json';
import type { CueSheet } from './types/cuesheet';

const persibVsBali = persibVsBaliData as CueSheet;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={persibVsBali.id}
        component={AgahVideoComposition}
        durationInFrames={Math.ceil(
          persibVsBali.durationInSeconds * persibVsBali.fps,
        )}
        fps={persibVsBali.fps}
        width={1080}
        height={1920}
        defaultProps={{ cuesheet: persibVsBali }}
      />
    </>
  );
};
