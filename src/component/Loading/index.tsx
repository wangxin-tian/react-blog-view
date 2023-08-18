import './index.scss';
import { createPortal } from 'react-dom';

interface Props {
    children: string
}

function Loading(props: Props) {

    return createPortal(
        <div className={'loading'}>
            {props.children.split('').map((item, index) => {
                return (
                    <span
                        className={`loading-text loading-text-${index + 1}`}
                        style={{ animationDelay: index * 0.1 + 's' }}
                    >
                        {item}
                    </span>
                );
            })}
        </div>,
        document.querySelector('#root')!,
    );
}

export default Loading;