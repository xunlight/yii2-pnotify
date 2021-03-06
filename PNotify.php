<?php
/*
* Displays notifications for user from yii2 flashes. Available types 'warning', 'info', 'success', 'error'
* 
* @package      Application
* @author       Xunlight <xelo.cz@gmail.com>
* @copyright    2016 Xunlight
* @version      1.0.0
* 
* @class        PNotify
*
* @description
* 
* Some info about jsquery plugin ->http://sciactive.com/pnotify
* 
*/
namespace xunlight\pnotify;

use Yii;

class PNotify extends \yii\bootstrap\Widget
{
    public $options = [];
    private $alertTypes = ['success','info','warning','error'];
    
    //papulate marker chars
    CONST POPULATE_MARKER_BEGIN = '{';
    CONST POPULATE_MARKER_END   = '}';
    CONST POPULATE_MARKER_DEFAULT = '{value}';
    
    //
    CONST C_EMPTY = '';
    
    /**
     * Initializes the PNotify widget.
	 * 
	 * @param    void
	 * @return   void
	 * 
	 * @since    1.0.0
	 *
	 */
    public function init()
    {
        parent::init();
        //assets
        PNotifyAsset::register($this->getView());
        
        //base objects
        $session   = \Yii::$app->getSession();
        $flashes   = $session->getAllFlashes();
        
        //go through all flashes
        foreach ($flashes as $type => $data) {
            //only for registered types
            if (in_array($type, $this->alertTypes)) {
                $data = (array) $data;
                //all mesages for this type
                foreach ($data as $i => $message) {
                    //show PNotify flash
                    Yii::$app->view->registerJs(static::populate('window.PNotifyObj.info("{title}", "{text}", "{type}");',[
                            'title' => \yii\helpers\Inflector::humanize( $type ),
                            'text'  => $message,
                            'type'  => $type,
                        ]));
                }
                $session->removeFlash($type);
            }
        }
    }
    
	/**
	 * Populates string 
	 * 
	 * @param    string template to use
	 * @param    array of options (relevant values of translation) or one string represents {value} marker
	 * @return   string
	 * 
	 * @since    1.0.0
	 *
	 */
    public static function populate($template, $options){
        $replace_pairs = [];
        if(is_array($options)){
            foreach ($options as $key => $value) {
                $replace_pairs[ static::POPULATE_MARKER_BEGIN . $key . static::POPULATE_MARKER_END ] = $value;
            }
        }else if((is_string($options))||(is_int($options))){
            $replace_pairs[ static::POPULATE_MARKER_DEFAULT ] = $options;
        }
        return strtr($template, $replace_pairs);
    }
    
    /**
	 * Set flash message shortcuts for \Yii::$app->session->setFlash
	 * 
	 * example: PNotify::setFlash('error', 'Error In world!');
	 * 
	 * @param    string type of message ->success|error|warning
	 * @param    string message to display
	 * @return   void
	 * 
	 * @since    1.0.0
	 *
	 */
    public static function setFlash($type, $message){
        \Yii::$app->session->setFlash($type, $message);
    }
}

/**
 * Asset bundle for PNotify
 *
 * @author xunlight
 * @since 1.0
 */
class PNotifyAsset extends \yii\web\AssetBundle
{

    public $depends = [
        'yii\web\JqueryAsset',
    ];
    
    public function init()
    {
        $this->sourcePath = dirname(__FILE__) . '/assets/';
        $this->setupAssets('css', ['pnotify','pnotify.brighttheme','pnotify.mobile']);
        $this->setupAssets('js', ['pnotify','pnotify.callbacks','xunlight.pnotify']);
        parent::init();
    }

    /**
     * Set up CSS and JS asset arrays based on the base-file names
	 * 
	 * example: 
	 * 
     * @param    string $type whether 'css' or 'js'
     * @param    array  $files the list of 'css' or 'js' basefile names
	 * 
	 * @since    1.0.0
	 *
	 */
    protected function setupAssets($type, $files = [])
    {
        $srcFiles = [];
        foreach ($files as $file) {
            $srcFiles[] = "{$type}/{$file}." . (YII_DEBUG?'':'min.') . "{$type}";
        }
        $this->$type = $srcFiles;
    }
}



