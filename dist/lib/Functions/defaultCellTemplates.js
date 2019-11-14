import { TextCellTemplate } from '../CellTemplates/TextCellTemplate';
import { NumberCellTemplate } from '../CellTemplates/NumberCellTemplate';
import { HeaderCellTemplate } from '../CellTemplates/HeaderCellTemplate';
import { CheckboxCellTemplate } from '../CellTemplates/CheckboxCellTemplate';
import { EmailCellTemplate } from '../CellTemplates/EmailCellTemplate';
import { GroupCellTemplate } from '../CellTemplates/GroupHeaderCellTemplate';
export var defaultCellTemplates = {
    text: new TextCellTemplate(),
    number: new NumberCellTemplate(),
    header: new HeaderCellTemplate(),
    checkbox: new CheckboxCellTemplate(),
    email: new EmailCellTemplate(),
    group: new GroupCellTemplate()
};
