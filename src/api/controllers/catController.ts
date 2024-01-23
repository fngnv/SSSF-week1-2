import {
  addCat,
  deleteCat,
  getAllCats,
  getCat,
  updateCat,
} from '../models/catModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';
import {
  MessageResponse,
  PostMessage,
  UploadResponse,
} from '../../types/MessageTypes';
import {Cat, User} from '../../types/DBTypes';

const catListGet = async (
  _req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGet = async (req: Request, res: Response<Cat>, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const cat = await getCat(id);
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catPost = async (
  req: Request<{}, {}, Omit<Cat, 'owner'> & {owner: number}>,
  res: Response<MessageResponse, {coords: [number, number]}>,
  next: NextFunction
) => {
  // catPost should use addCat function from catModel --done?
  // catPost should use validationResult to validate req.body --done
  // catPost should use req.file to get filename --done
  // catPost should use res.locals.coords to get lat and lng (see middlewares.ts) --done
  // catPost should use req.user to get user_id and role (see passport/index.ts and express.d.ts) --done?
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (!req.body.filename && req.file) {
      req.body.filename = req.file.filename;
    }
    if (!req.body.lat) {
      req.body.lat = Number(res.locals.coords[0]);
    }
    if (!req.body.lng) {
      req.body.lng = Number(res.locals.coords[1]);
    }
    if (!req.body.owner) {
      req.body.owner = (req.user as User).user_id;
    }

    const catID = await addCat(req.body);

    const message: UploadResponse = {
      message: 'Cat added',
      id: catID,
    };
    res.send(message);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: string}, {}, Cat>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const cat = req.body;
    const result = await updateCat(
      cat,
      id,
      (req.user as User).user_id,
      (req.user as User).role
    );
    console.log('ITS A CAT PUT METHOD!' + id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// catDelete should use deleteCat function from catModel --done
// catDelete should use validationResult to validate req.params.id --done
const catDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_delete validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = Number(req.params.id);
    const result = await deleteCat(id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {catListGet, catGet, catPost, catPut, catDelete};
