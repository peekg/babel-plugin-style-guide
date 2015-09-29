import 'better-log/install';
import fs from 'fs';

module.exports = function ({ Plugin, types: t, parse, traverse }) {
  
  class ReactComponent {
    
    static is (node) {
      return t.isMemberExpression( node.callee ) &&
      t.isIdentifier( node.callee.object, {name:"React"} ) &&
      t.isIdentifier( node.callee.property, {name:"createClass"} );
    }
    
    constructor () {
      this.displayName = "";
    }
    
    setDisplayName (node) {
      if( t.isAssignmentExpression(node) ) {
        if( t.isIdentifier(node.left) ) {
          this.displayName = node.left.name;
        }
      } else if ( t.isVariableDeclarator(node) ) {
        if( t.isIdentifier( node.id ) ) {
          this.displayName = node.id.name;
        }
      } else if ( t.isProperty(node) ) {
        if( t.isIdentifier( node.key ) ) {
          this.displayName = node.key.name;
        }
      } else {
        console.warn("Could not define displayName.");
      }
      return this;
    }
    
  }

  var components = new Array(),
  stack = new Array(),
  peek = function () { return stack[stack.length-1]; },
  stacked = function () { return stack.length != 0; };
  
  return new Plugin( "style-guide", {
    visitor: {
        Program: {
          exit(node, parent, scope, file) {
            fs.writeFileSync( file.opts.sourceFileName.replace().replace( /.jsx?$/, ".json" ), 
                JSON.stringify( components ) );
          }
        },
        CallExpression: {
          enter(node, parent) {
            if( ReactComponent.is( node ) ) {
              stack.push( new ReactComponent()
              .setDisplayName( parent ) );
            }
          },
          exit(node, parent) {
            if( stacked() ) {
              if( ReactComponent.is( node ) ) {
                components.push( stack.pop() );
              }
            }
          }
        }
      }
  });
};
