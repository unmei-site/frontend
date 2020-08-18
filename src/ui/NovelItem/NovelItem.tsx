import React from 'react';
import { TranslateStatus } from '../../api/api';
import { Link } from 'react-router-dom';
import './NovelItem.sass';
import {capitalize, generateClassName} from "../../utils";

type Props = {
    id: number
    original_name: string
    viewType: string
    novelId?: number
    localized_name?: string
    image?: string
    status?: string
    mark?: number
}

const NovelItem = ({ id, original_name, localized_name, image, status, mark, viewType, novelId }: Props) => (
    <Link to={`/novels/${id}`} className={generateClassName("NovelItem", capitalize(viewType) || 'Grid')}>
        {viewType === 'grid' && (<>
            <div className='NovelItem__Image' style={{ backgroundImage: `url(${image || '/static/img/no-image.png'})` }}/>
            <div className="NovelItem__Title">
                {localized_name || original_name}
            </div>
            {status && <div className="NovelItem__Status">
                {TranslateStatus[status]} {mark !== undefined && mark > 0 && mark}
            </div>}
        </>)}
        {viewType === 'table' && (<>
            <div className="NovelItem__Component">{novelId || ''}</div>
            <div className="NovelItem__Title">
                {localized_name || original_name}
            </div>
            {status && <div className="NovelItem__Status">
                {TranslateStatus[status]} {mark !== undefined && mark > 0 && mark}
            </div>}
        </>)}
    </Link>
);

export default NovelItem;