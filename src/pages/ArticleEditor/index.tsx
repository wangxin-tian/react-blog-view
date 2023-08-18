import { Button, DatePicker, Input, Modal, Select, Image, Switch } from 'antd';
import './index.scss';
import { useEffect, useRef, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import Cropper, { ReactCropperElement } from 'react-cropper'; // 引入Cropper
import 'cropperjs/dist/cropper.css'; // 引入Cropper对应的css
import { blobToFile, changeBuffer } from '@/tools';
import MyReactMarkdown from '@/component/MyReactMarkdown';
import {
  useChangePageTitle,
  useGetArticleDetail,
  useGetTagListData,
  useOpenMessageThrottle,
  useShowPromiseModal,
} from '@/hook';
import { addArticle, updateArticle } from '@/request';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import defaultImage from '@/assets/images/default.png';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Editor from 'react-markdown-editor-lite';
import MyFontUnderline from './MyFontUnderline';
import CollapseList from './CollapseList';

const validationForm: { target: keyof ArticleForm; content: string }[] = [
  {
    target: 'title',
    content: '请输入文章标题',
  },
  {
    target: 'tagId',
    content: '请选择文章标签',
  },
  {
    target: 'introduction',
    content: '请输入文章简介',
  },
  {
    target: 'content',
    content: '请输入文章内容',
  },
  {
    target: 'createTime',
    content: '创建日期为空',
  },
  {
    target: 'modiTime',
    content: '修改日期为空',
  },
];

Editor.use(Plugins.TabInsert, {
  tabMapValue: 1,
});

Editor.use(MyFontUnderline);

Editor.use(CollapseList);

const plugins = [
  'header',
  'font-bold',
  'font-italic',
  'font-strikethrough',
  'my-font-underline',
  'divider',
  'list-unordered',
  'list-ordered',
  'collapse-list',
  'divider',
  'block-wrap',
  'block-quote',
  'block-code-inline',
  'block-code-block',
  'divider',
  'table',
  'image',
  'link',
  'divider',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
  'tab-insert',
];

function AddArticle() {
  //编辑状态初始化
  const [searchParams] = useSearchParams(); //query参数
  const { articleDetail, updateArticleDetail, imageSrc } =
    useGetArticleDetail();
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) return;
    updateArticleDetail(id);
  }, [searchParams, updateArticleDetail]);

  useEffect(() => {
    if (!articleDetail) return;
    const { content, title, introduction, createTime, tag, publicState } =
      articleDetail;
    setArticleForm((state) => {
      return {
        content,
        title,
        introduction,
        createTime,
        modiTime: dayjs(),
        tagId: tag.id,
        publicState,
      };
    });
  }, [articleDetail]);

  //表单处理
  const loadStoreArticleData: ArticleForm | {} = JSON.parse(
    localStorage.getItem('article') || '{}',
  );

  const articleFormDefaultValue = () => {
    if (JSON.stringify(loadStoreArticleData) !== '{}') {
      const data = loadStoreArticleData as ArticleForm;
      data.createTime = dayjs();
      data.modiTime = dayjs();
      return data;
    }
    return {
      title: '',
      content: '',
      introduction: '',
      tagId: '0',
      publicState: true,
      createTime: dayjs(),
      modiTime: dayjs(),
    };
  };

  const [articleForm, setArticleForm] = useState<ArticleForm>(
    articleFormDefaultValue(),
  );

  const changeArticleForm: SetStateHandleFunction<typeof articleForm> = (
    target,
    value,
  ) => {
    setArticleForm((state) => {
      state[target] = value;
      return { ...state };
    });
  };

  //标签处理
  const { tagList } = useGetTagListData();

  const [selectOptions, setSelectOptions] = useState([
    { value: '0', label: 'default' },
  ]);

  useEffect(() => {
    if (!tagList.length) return;
    setSelectOptions((state) => {
      return tagList.map((item, index) => {
        return { value: item.id, label: item.name };
      });
    });
    setArticleForm((state) => {
      if (state.tagId === '0') {
        state.tagId = tagList[0].id;
      }
      return { ...state };
    });
  }, [tagList]);

  useEffect(() => {
    setArticleForm((state) => {
      state.tagId = articleDetail?.tag.id || state.tagId;
      return { ...state };
    });
  }, [articleDetail]);

  const handleSelectChange = (value: string) => {
    setArticleForm((state) => {
      state.tagId = value;
      return { ...state };
    });
  };

  //图片上传处理
  const imageFileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>();
  const [originFile, setOriginFile] = useState<File | null>();
  const mbSize = 1024 * 1024;
  const rate = 20;
  const maxSize = mbSize * rate;

  const FileChangeHandle = () => {
    if (!imageFileInput.current) return;
    const files = imageFileInput.current.files;
    if (!files || files.length === 0) return;
    const temp = files[0];
    imageFileInput.current.value = '';
    if (!/(PNG|JPG|JPEG)/i.test(temp.type))
      return openMessage({ content: '格式错误，请选择png、jpg、jpeg文件' });
    if (temp.size > maxSize)
      return openMessage({ content: `超出大小，请选择小于${rate}MB的图片` });
    setOriginFile(temp);
    setIsModalOpen(true);
  };

  const imgDropHandle = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!imageFileInput.current) return;
    imageFileInput.current.files = e.dataTransfer.files;
    FileChangeHandle();
  };

  //图片剪切模态框
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    const cropper: Cropper = Reflect.get(cropperRef.current!, 'cropper');
    cropper.getCroppedCanvas().toBlob((res) => {
      if (!res) return;
      const newFile = blobToFile(res, originFile?.name);

      setFile(newFile);
      setIsModalOpen(false);
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //消息框
  const openMessage = useOpenMessageThrottle(1000, { type: 'warning' });

  //裁剪处理
  const cropperRef = useRef<HTMLImageElement | ReactCropperElement>(null);

  const cropperSrc = () => {
    if (originFile) return URL.createObjectURL(originFile);
    return '';
  };

  //文章新增、编辑、保存
  const navigate = useNavigate();
  const showPromiseModal = useShowPromiseModal('confirm');

  const submit = async () => {
    showPromiseModal({
      title: '发布文章',
      content: '确认提交操作？',
      async onOk(...args) {
        if (mode === '发布文章' && !file) {
          openMessage({ content: '请选择文章封面图片' });
          return;
        }
        const validate = validationForm.every((rule) => {
          if (!articleForm[rule.target]) {
            openMessage({ content: rule.content });
            return false;
          }
          return true;
        });
        if (!validate) return;
        const { createTime, modiTime } = articleForm;
        const nArticle = {
          ...articleForm,
          createTime: createTime.toString(),
          modiTime: modiTime.toString(),
          id: articleDetail?.id,
        };
        try {
          const fd = new FormData();
          fd.append('article', JSON.stringify(nArticle));
          if (file) {
            const { filename } = await changeBuffer(file);
            fd.append('file', new File([file], filename, { type: file.type }));
          }
          let res;
          if (mode === '发布文章') {
            res = await addArticle(fd);
            localStorage.removeItem('article');
          } else {
            res = await updateArticle(fd);
          }
          openMessage({ content: mode + '成功', type: 'success' });
          navigate('/article/' + res.id);
        } catch (error) {
          openMessage({ content: (error as Error).message, type: 'warning' });
        }
      },
    });
  };

  const save = () => {
    showPromiseModal({
      title: '保存文章至本地',
      content: '确认操作？',
      onOk(...args) {
        localStorage.setItem('article', JSON.stringify(articleForm));
        openMessage({ content: '文章保存成功', type: 'success' });
      },
    });
  };

  const mode = articleDetail ? '修改文章' : '发布文章';
  useChangePageTitle('水晶世界-' + mode, [mode]);
  return (
    <div className='article-editor' id='article-editor'>
      <h1>{mode}</h1>
      <div className='edit-head'>
        <Input
          className='input-title'
          placeholder='文章标题'
          value={articleForm.title}
          onChange={(e) => {
            changeArticleForm('title', e.target.value);
          }}
        />
        <Select
          value={articleForm.tagId}
          style={{ minWidth: 120 }}
          onChange={handleSelectChange}
          options={selectOptions}
        />
        <Button onClick={save}>保存文章</Button>
        <Button onClick={submit} type='primary'>
          {mode}
        </Button>
      </div>
      <TextArea
        rows={3}
        placeholder='文章简介'
        maxLength={180}
        showCount
        value={articleForm.introduction}
        onChange={(e) => {
          changeArticleForm('introduction', e.target.value);
        }}
      />
      <MdEditor
        className='article-editor'
        placeholder='请输入Markdown文本'
        renderHTML={() => {
          return <MyReactMarkdown markdown={articleForm.content} />;
        }}
        htmlClass='preview'
        markdownClass='editor-input'
        table={{ maxRow: 8, maxCol: 8 }}
        plugins={plugins}
        value={articleForm.content}
        onChange={({ text }) => changeArticleForm('content', text)}
      />
      <div className='state-config'>
        <span>
          发布日期：
          <DatePicker
            placeholder='发布日期'
            value={articleForm.createTime}
            onChange={(value) => {
              changeArticleForm('createTime', value || dayjs());
            }}
          />
        </span>
        <span>
          修改日期：
          <DatePicker
            placeholder='修改日期'
            value={articleForm.modiTime}
            onChange={(value) => {
              changeArticleForm('modiTime', value || dayjs());
            }}
          />
        </span>
        <Switch
          checkedChildren='公开'
          unCheckedChildren='私有'
          checked={articleForm.publicState}
          onChange={(e) => {
            changeArticleForm('publicState', e);
          }}
        />
      </div>
      <div className='image-pick'>
        <div
          className='img-drag'
          onDrop={imgDropHandle}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            imageFileInput.current!.click();
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              <UploadOutlined />
              封面
            </span>
            <span>{file && `${~~((file?.size || 0) / 1024)} KB`}</span>
          </div>
        </div>
        <input
          onChange={FileChangeHandle}
          type='file'
          ref={imageFileInput}
          style={{ display: 'none' }}
          accept='.png,.jpeg,.jpg'
        />
        {(file || articleDetail?.imageSrc) && (
          <Image
            src={(file && URL.createObjectURL(file)) || imageSrc}
            alt={articleDetail?.title || '文章图片'}
            title={articleDetail?.title || '文章图片'}
            fallback={defaultImage}
            loading='lazy'
          />
        )}
        <Modal
          title='图片裁剪，比例为16:9'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          getContainer={() => {
            return document.getElementById('article-editor')!;
          }}
        >
          <Cropper
            ref={cropperRef}
            src={cropperSrc()}
            viewMode={3}
            aspectRatio={16 / 9}
            className='image-crop'
          ></Cropper>
        </Modal>
      </div>
    </div>
  );
}

export default AddArticle;
