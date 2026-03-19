"use client";
// import { setRadiologyMode  } from '@/store/features/settings/global'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store/store'
// import Grid from './grid';
import Row2D from './row2d';
import Single from './single';

export default function Viewer() {
  const viewMode = useSelector((state: RootState) => state.global.vieweMode)

  return (
    <>
      {/* {viewMode === "grid" && <Grid />} */}
      {viewMode === "row2d" && <Row2D />}
      {/* @ts-ignore */}
      {<Single view={viewMode} />}
    </>
  );
}
