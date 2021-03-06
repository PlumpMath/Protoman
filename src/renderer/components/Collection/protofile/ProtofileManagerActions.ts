import { ThunkAction } from 'redux-thunk';
import { ProtoCtx } from '../../../models/http/body/protobuf';
import { AppState } from '../../../models/AppState';
import { AnyAction } from 'redux';
import { buildContext } from '../../../models/poc/engine/protoParser';

type SetProtofiles = {
  type: 'SET_PROTOFILES';
  collectionName: string;
  filepaths: string[];
};

const SET_PROTOFILES = 'SET_PROTOFILES';

type BuildProtofiles = {
  type: 'BUILD_PROTOFILES';
  collectionName: string;
  filepaths: string[];
};

const BUILD_PROTOFILES = 'BUILD_PROTOFILES';

type BuildProtofilesSuccess = {
  type: 'BUILD_PROTOFILES_SUCCESS';
  collectionName: string;
  ctx: ProtoCtx;
};

const BUILD_PROTOFILES_SUCCESS = 'BUILD_PROTOFILES_SUCCESS';

type BuildProtofilesFailure = {
  type: 'BUILD_PROTOFILES_FAILURE';
  collectionName: string;
  err: Error;
};

const BUILD_PROTOFILES_FAILURE = 'BUILD_PROTOFILES_FAILURE';

type ResetProtofileStatus = {
  type: 'RESET_PROTOFILE_STATUS';
  collectionName: string;
};

const RESET_PROTOFILE_STATUS = 'RESET_PROTOFILE_STATUS';

export const ProtofileManagerActionTypes = [
  SET_PROTOFILES,
  BUILD_PROTOFILES,
  BUILD_PROTOFILES_SUCCESS,
  BUILD_PROTOFILES_FAILURE,
  RESET_PROTOFILE_STATUS,
];
export type ProtofileManagerActions =
  | SetProtofiles
  | BuildProtofiles
  | BuildProtofilesSuccess
  | BuildProtofilesFailure
  | ResetProtofileStatus;

export function buildProtofiles(
  collectionName: string,
  filepaths: string[],
): ThunkAction<Promise<void>, AppState, {}, AnyAction> {
  return async (dispatch): Promise<void> => {
    if (filepaths) {
      dispatch({ type: BUILD_PROTOFILES, collectionName, filepaths });
      try {
        const ctx = await buildContext(filepaths);
        dispatch({ type: BUILD_PROTOFILES_SUCCESS, collectionName, ctx });
        dispatch({ type: SET_PROTOFILES, collectionName, filepaths });
      } catch (err) {
        dispatch({ type: BUILD_PROTOFILES_FAILURE, collectionName, err });
      }
    }
  };
}

export function resetProtofileStatus(collectionName: string): ResetProtofileStatus {
  return {
    type: RESET_PROTOFILE_STATUS,
    collectionName,
  };
}
