import React, { Component } from 'react';
import '@/assets/css/template_control.scss';
import '@/assets/css/template-theme.scss';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@/assets/css/template_control.scss';
import { templateDetail } from '@/api/template';
import { Tree, Icon } from 'antd';


const { TreeNode, DirectoryTree } = Tree;

class TemplateControl extends Component {

  state = {
    detail: '',
    jsonSchemas: '',
    coverStyle: ''
  }

  componentDidMount () {
    let id = this.props.match.params.id
    templateDetail(id).then(res => {
      if (res.statusCode === '000000') {
        this.setState({
          detail: res.data.cover,
          jsonSchemas: res.data.jsonSchemas,
          coverStyle: res.data.coverStyle
        })
      }
    })
  }

  boolean = () => {
    // BAlloonEditor.create()
  }

  onSelect = (keys, b, c) => {
    console.log(keys, b, c);
    // console.log(222);
  }



  handleSchemas = () => {
    console.log('111')
  }
  render () {
    let { detail, coverStyle, jsonSchemas } = this.state;
    class Plugins {
      constructor(editor) {
        this.editor = editor
      }
      init () {
        let editor = this.editor
        console.log(editor.plugins.get('FileRepository'))
        console.log(editor.addCommand)
        // return
      }
    }

    return (
      <div className='template_control' >
        <div className='control'>
          <h4>模板编辑器</h4>
          {
            jsonSchemas.length && jsonSchemas.map(item =>
              <div className='event-source' key={item.schema_as_tree.name}>
                <h5><small>陈述:</small> {item.schema_as_tree.name}  <span>{item.schema_as_tree.type}</span> </h5>
                <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} >
                  <TreeNode title={item.schema_as_tree.name} key={item.schema_as_tree.name}>
                    {
                      item.schema_as_tree.children.length
                      &&
                      item.schema_as_tree.children.map(i =>
                        <TreeNode icon={() => < Icon type="plus" />}
                          isLeaf title={i.name} key={i.name} type={i.type} />
                      )
                    }
                  </TreeNode>
                </DirectoryTree>
              </div>
            )
          }
        </div>
        <div id='workspace'>
          <div id="coverEditor" className={`page cert-cover ${coverStyle}`}>
            <CKEditor
              className='ck-content'
              editor={ClassicEditor}
              data={detail || ""}
              config={{
                language: 'zh-ch',
                toolbar: [],
                // extraPlugins: [Plugins],
                // allowedContent: true,
                // extraAllowedContent: 'div(*);'
              }}
              onInit={editor => {
                // console.log(editor.isReadOnly = true)
                console.log(editor.model);
              }}

              onChange={(event, editor) => {
                const data = editor.getData();
                this.setState({
                  detail: data
                });
              }}

              onFocus={(event, editor) => {
                // console.log(editor.config)
                // editor.config._config.toolbar = ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'];
                // editor.config._config.heading = {
                //   options: [
                //     { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                //     { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                //     { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                //   ]
                // }

                // var viewFragment = editor.data.processor.toView('111');
                // var modelFragment = editor.data.toModel(viewFragment);
                // //插入模型片段
                // editor.model.insertContent(modelFragment, editor.model.document.selection);

              }}
              onBlur={(event, editor) => {
                // console.log(event, editor)
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default TemplateControl