import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import {BoardColumnRepository} from '../repositories/boardColumn.repository';
import {getWebError} from '../helpers/error.helper';

class BoardColumnController {
	getAll = async (req: Request, res: Response): Promise<void> => {
		const boardColumnRepository = getCustomRepository(BoardColumnRepository);
		const boards = await boardColumnRepository.getAll();

		res.status(200).send(boards);
	};

	getOne = async (req: Request, res: Response): Promise<void> => {
		const boardColumnRepository = getCustomRepository(BoardColumnRepository);
		const { id } = req.params;

		try {
			const board = await boardColumnRepository.getOne(id);
			res.status(200).send(board);
		} catch (e) {
			res.status(404).send(getWebError(e,404));
		}
	};

	put = async (req: Request, res: Response): Promise<void> => {
		const boardColumnRepository = getCustomRepository(BoardColumnRepository);
		const { id } = req.params;
		const { body } = req;

		try {
			const boardColumns = await boardColumnRepository.put(id, body);

			res.status(200).send(boardColumns);
		} catch (e) {
			res.status(404).send(getWebError(e,404));
		}
	};

	post = async (req: Request, res: Response): Promise<void> => {
		const boardColumnRepository = getCustomRepository(BoardColumnRepository);
		const { body } = req;
		try{
			const board = await boardColumnRepository.post(body);

			res.status(200).send(board);
		}catch (e) {
			res.status(404).send(getWebError(e,404));
		}
	};

	delete = async (req: Request, res: Response): Promise<void> => {
		const boardColumnRepository = getCustomRepository(BoardColumnRepository);
		const { id } = req.params;

		try {
			const board = await boardColumnRepository.deleteColumn(id);

			res.status(200).send(board);
		} catch (e) {
			res.status(404).send(getWebError(e,404));
		}
	};
}

export default BoardColumnController;
