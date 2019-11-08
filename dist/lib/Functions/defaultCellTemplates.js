import { TextCellTemplate } from '../CellTemplates/TextCellTemplate';
import { NumberCellTemplate } from '../CellTemplates/NumberCellTemplate';
import { HeaderCellTemplate } from '../CellTemplates/HeaderCellTemplate';
export var defaultCellTemplates = {
    text: new TextCellTemplate(),
    number: new NumberCellTemplate(),
    header: new HeaderCellTemplate(),
};
