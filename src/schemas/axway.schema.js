import Joi from 'joi';
import moment from 'moment-timezone';

const currentDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
export const dateSchema = Joi.object({
    startDate: Joi.date().iso().max(currentDate).required().messages({
        'date.max': `"startDate" must not be greater than today`,
    }).custom((value, helpers) => {
        if (moment(value).format('YYYY-MM-DD') === currentDate) {
            return helpers.message(`"startDate" cannot be today`);
        }
        return value;
    }),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).max(currentDate).required().messages({
        'date.min': `"endDate" must be greater than or equal to "startDate"`,
        'date.max': `"endDate" must not be greater than today`,
    }).custom((value, helpers) => {
        if (moment(value).format('YYYY-MM-DD') === currentDate) {
            return helpers.message(`"endDate" cannot be today`);
        }
        return value;
    }),
});